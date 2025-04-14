import { Injectable } from '@nestjs/common';
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
    const users: User[] = await this.entityManager.find(User);

    const now = new Date();
    const payrolls: Payroll[] = users.map((user) => {
      return this.payrollRepository.create({
        user,
        year: now.getFullYear(),
        month: now.getMonth() + 1
      });
    });

    return await this.payrollRepository.save(payrolls);
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

  private calculateTotalDeductions(payroll: Payroll): number {
    const { incomeTax, penalties, advances, socialInsurance } = payroll;
    return incomeTax + penalties + advances + socialInsurance;
  }

  private calculateTotalSalary(payroll: Payroll): number {
    const {
      currencyDifference,
      foodAllowance,
      transportationAllowance,
      bonusesAndAllowances,
      medical,
      totalAttendance,
      dailySalary
    } = payroll;

    const additionalSalary: number =
      currencyDifference +
      foodAllowance +
      transportationAllowance +
      bonusesAndAllowances +
      medical;

    const workingSalary: number = totalAttendance * dailySalary;
    return additionalSalary + workingSalary;
  }

  private calculateDailyDifference(payroll: Payroll): number {
    const siteContractedDays: number =
      payroll?.user?.site?.contractedDays || 15;

    return (payroll.attendance - siteContractedDays) * 0.4;
  }

  private calculateTotalAttendance(payroll: Payroll): number {
    const workingHours: number = payroll?.user?.site?.workingHrsPerDay || 8;
    return payroll.overtimeInHours / workingHours + payroll.attendance;
  }

  private calculateCurrencyDifference(payroll: Payroll): number {
    if (payroll.dailyDifference) {
      return payroll.dailySalary * payroll.dailyDifference;
    }
    return 0;
  }

  private calculateNetSalary(payroll: Payroll): number {
    const { totalSalary, totalDeductions } = payroll;
    return totalSalary - totalDeductions;
  }

  private processPayroll(payroll: Payroll): Payroll {
    payroll.totalAttendance = this.calculateTotalAttendance(payroll);
    payroll.totalDeductions = this.calculateTotalDeductions(payroll);
    payroll.dailyDifference = this.calculateDailyDifference(payroll);
    payroll.currencyDifference = this.calculateCurrencyDifference(payroll);
    payroll.totalSalary = this.calculateTotalSalary(payroll);
    payroll.netSalary = this.calculateNetSalary(payroll);
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
