import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { PayrollQueryDto } from './dto/payroll-query.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {}

  async submitPayrolls(): Promise<void> {
    const existingPayrolls: Payroll[] = await this.findAllCurrent();

    if (existingPayrolls.length == 0) {
      await this.markPayrollsAsPast();
      await this.createPayrollForAllUsers();
    }
  }

  private async createPayrollForAllUsers(): Promise<Payroll[]> {
    const users: User[] = await this.entityManager.find(User, {
      relations: ['salaryDetails'],
      where: {
        isActive: true
      }
    });

    const now = new Date();
    const payrolls: Payroll[] = users.map((user) => {
      const payroll: Payroll = this.payrollRepository.create({
        user,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        dailySalary: user.salaryDetails?.dailySalary ?? 0,
        medical: user.salaryDetails?.medical ?? 0,
        incomeTax: user.salaryDetails?.incomeTax ?? 0,
        foodAllowance: user.salaryDetails?.foodAllowance ?? 0,
        socialInsurance: user.salaryDetails?.socialInsurance ?? 0,
        transportationAllowance:
          user.salaryDetails?.transportationAllowance ?? 0
      });

      this.processPayroll(payroll);
      return payroll;
    });

    return await this.payrollRepository.save(payrolls);
  }

  async createPayrollForUser(user: User): Promise<Payroll> {
    const now = new Date();
    const payroll: Payroll = this.payrollRepository.create({
      user,
      year: now.getFullYear(),
      month: now.getMonth() + 1
    });

    return this.payrollRepository.save(payroll);
  }

  private async markPayrollsAsPast(): Promise<void> {
    const payrolls: Payroll[] = await this.payrollRepository.find({
      where: { isPast: false }
    });
    payrolls.forEach((payroll) => {
      payroll.isPast = true;
    });

    await this.payrollRepository.save(payrolls);
  }

  private calculateTotalDeductions(
    incomeTax: number,
    penalties: number,
    advances: number,
    socialInsurance: number
  ): number {
    return incomeTax + penalties + advances + socialInsurance;
  }

  private calculateTotalSalary(
    currencyDifference: number,
    foodAllowance: number,
    transportationAllowance: number,
    bonusesAndAllowances: number,
    medical: number,
    totalAttendance: number,
    dailySalary: number
  ): number {
    const additionalSalary: number =
      currencyDifference +
      foodAllowance +
      transportationAllowance +
      bonusesAndAllowances +
      medical;

    const workingSalary: number = totalAttendance * dailySalary;
    return additionalSalary + workingSalary;
  }

  private calculateDailyDifference(
    contractedDays: number,
    attendance: number
  ): number {
    const siteContractedDays: number = contractedDays || 15;

    return (attendance - siteContractedDays) * 0.4;
  }

  private calculateTotalAttendance(
    overtimeInHours: number,
    attendance: number,
    workingHrsPerDay: number
  ): number {
    const workingHours: number = workingHrsPerDay || 8;
    return overtimeInHours / workingHours + attendance;
  }

  private calculateCurrencyDifference(
    dailySalary: number,
    dailyDifference: number
  ): number {
    if (dailyDifference) {
      return dailySalary * dailyDifference;
    }
    return 0;
  }

  private calculateNetSalary(
    totalSalary: number,
    totalDeductions: number
  ): number {
    return totalSalary - totalDeductions;
  }

  private processPayroll(payroll: Payroll): Payroll {
    const totalAttendance: number = this.calculateTotalAttendance(
      payroll.overtimeInHours,
      payroll.attendance,
      payroll?.user?.site?.workingHrsPerDay
    );
    payroll.totalAttendance = totalAttendance;
    const totalDeductions = this.calculateTotalDeductions(
      payroll.incomeTax,
      payroll.penalties,
      payroll.advances,
      payroll.socialInsurance
    );
    payroll.totalDeductions = totalDeductions;
    payroll.dailyDifference = this.calculateDailyDifference(
      payroll?.user?.site?.contractedDays,
      payroll.attendance
    );
    const currencyDifference: number = this.calculateCurrencyDifference(
      payroll.dailySalary,
      payroll.dailyDifference
    );
    payroll.currencyDifference = currencyDifference;
    const totalSalary: number = this.calculateTotalSalary(
      currencyDifference,
      payroll.foodAllowance,
      payroll.transportationAllowance,
      payroll.bonusesAndAllowances,
      payroll.medical,
      totalAttendance,
      payroll.dailySalary
    );
    payroll.totalSalary = totalSalary;
    payroll.netSalary = this.calculateNetSalary(totalSalary, totalDeductions);
    return payroll;
  }

  async findAllPast(query: PayrollQueryDto): Promise<Payroll[]> {
    const where: Partial<Payroll> = this.applyFilters(query);

    return this.payrollRepository.find({
      relations: ['user'],
      where
    });
  }

  private applyFilters(query: PayrollQueryDto): Partial<Payroll> {
    const where: any = {
      isPast: true
    };

    if (query?.month) {
      where.month = query.month;
    }

    if (query?.year) {
      where.year = query.year;
    }

    if (query?.nameSearch || query?.siteId) {
      where.user = {};

      if (query?.nameSearch) {
        where.user.fullname = ILike(`%${query.nameSearch}%`);
      }

      if (query?.siteId) {
        where.user.site = { id: query.siteId };
      }
    }
    return where;
  }

  async findAllCurrent(query?: PayrollQueryDto): Promise<Payroll[]> {
    const where: Partial<Payroll> = this.applyFilters(query);

    const now = new Date();

    return this.payrollRepository.find({
      relations: ['user'],
      where: {
        ...where,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        isPast: false
      }
    });
  }

  async findOne(id: number): Promise<Payroll> {
    return this.payrollRepository.findOne({
      relations: ['user.site'],
      where: { id }
    });
  }

  async update(
    id: number,
    updatePayrollDto: UpdatePayrollDto
  ): Promise<Payroll> {
    let payroll: Payroll = await this.findOne(id);
    Object.assign(payroll, updatePayrollDto);
    payroll = this.processPayroll(payroll);
    await this.payrollRepository.save(payroll);
    return this.findOne(id);
  }
}
