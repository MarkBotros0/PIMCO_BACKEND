import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRole } from './enums/user-roles.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDocuments } from './entities/user-documents.entity';
import { UserDocumentsDto } from './dtos/user-documents.dto';
import { EmployeeTypeEntity } from './entities/employee-type.entity';
import { PayrollsService } from '../payrolls/payrolls.service';
import { SalaryDetails } from './entities/salary-details.entity';
import { UsersQueryDto } from './dtos/users-query.dto';
import { SitesService } from '../sites/sites.service';
import { Site } from '../sites/entities/site.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserDocuments)
    private readonly userDocumentsRepository: Repository<UserDocuments>,
    @InjectRepository(EmployeeTypeEntity)
    private readonly employeeTypeEntityRepository: Repository<EmployeeTypeEntity>,
    @InjectRepository(SalaryDetails)
    private readonly salaryDetailsRepository: Repository<SalaryDetails>,
    private readonly payrollsService: PayrollsService,
    private readonly sitesService: SitesService
  ) {}

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { phoneNumber }
    });

    if (!user)
      throw new NotFoundException(
        `User with phoneNumber: ${phoneNumber} is not found`
      );

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      relations: ['employeeType', 'documents', 'salaryDetails', 'site'],
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    return user;
  }

  async create(
    phoneNumber: string,
    data?: Partial<Omit<User, 'phoneNumber'>>
  ): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { phoneNumber }
    });

    if (user) {
      throw new BadRequestException(
        `User with phone number ${phoneNumber} is already registered`
      );
    }

    return this.usersRepository.save({ phoneNumber, ...data });
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.findOneById(userId);

    const {
      phoneNumber,
      password,
      documents,
      salaryDetails,
      siteId,
      ...updateUserData
    } = updateUserDto;

    if (siteId) {
      user.site = await this.sitesService.findOne(siteId);
    }

    Object.assign(user, updateUserData);
    await this.usersRepository.save(user);

    if (documents) {
      await this.userDocumentsRepository.update(user.documents.id, documents);
    }

    if (salaryDetails) {
      await this.salaryDetailsRepository.update(
        user.salaryDetails.id,
        salaryDetails
      );
    }

    return this.findOneById(user.id);
  }

  async addHrRoleToUser(userId: number) {
    const user: User = await this.findOneById(userId);
    user.roles.push(UserRole.HUMAN_RESOURCES);
    return this.usersRepository.save(user);
  }

  async getAllHrForAdmin(): Promise<User[]> {
    return this.usersRepository.find({
      where: { roles: UserRole.HUMAN_RESOURCES }
    });
  }

  async isHr(user: number | User): Promise<boolean> {
    if (typeof user === 'number') {
      const foundUser: User = await this.findOneById(user);
      return foundUser.roles.includes(UserRole.HUMAN_RESOURCES);
    }
    return user.roles.includes(UserRole.HUMAN_RESOURCES);
  }

  async isExistingUser(phoneNumber: string): Promise<boolean> {
    const user: User = await this.usersRepository.findOne({
      where: { phoneNumber }
    });

    return !!user;
  }

  async getAllInActiveUsers(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['documents'],
      where: {
        isActive: false
      }
    });
  }

  async acceptUserRequest(userId: number): Promise<void> {
    const user: User = await this.findOneById(userId);
    if (!user || user.isActive) {
      throw new BadRequestException(
        "User is already active or didn't send request"
      );
    }
    user.isActive = true;
    await this.usersRepository.save(user);
    await this.payrollsService.createPayrollForUser(user);
  }

  async rejectUserRequest(userId: number): Promise<void> {
    const user: User = await this.findOneById(userId);
    if (!user || user.isActive) {
      throw new BadRequestException(
        "User is already active or didn't send request"
      );
    }
    await this.usersRepository.delete({ id: user.id });
  }

  async isValidEmployeeType(employeeTypeId: number): Promise<boolean> {
    const type = await this.employeeTypeEntityRepository.findOne({
      where: { id: employeeTypeId }
    });
    if (!type) {
      throw new BadRequestException('Employee type not found');
    }
    return true;
  }

  async createUser(
    createUserDto: CreateUserDto,
    isActive: boolean = false
  ): Promise<User> {
    const existingUser: User = await this.usersRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber }
    });

    await this.isValidEmployeeType(createUserDto.employeeTypeId);

    if (existingUser) {
      throw new BadRequestException(
        'User already exist or has request submitted'
      );
    }

    const site: Site = await this.sitesService.findOne(createUserDto.siteId);

    const user: User = await this.usersRepository.save({
      phoneNumber: createUserDto.phoneNumber,
      password: createUserDto.password,
      fullname: createUserDto.fullname,
      dateOfBirth: createUserDto.dateOfBirth ?? null,
      isActive,
      employeeType: { id: createUserDto.employeeTypeId },
      site
    });

    await this.salaryDetailsRepository.save({ user });

    if (createUserDto.documents) {
      await this.addDocumentsToUser(user, createUserDto.documents);
    }
    return user;
  }

  async addDocumentsToUser(
    user: User,
    documents: UserDocumentsDto
  ): Promise<void> {
    const userDocumentsData = {
      birthCertificate: documents?.birthCertificate ?? null,
      militaryCertificate: documents?.militaryCertificate ?? null,
      militaryCertificateExpiration:
        documents?.militaryCertificateExpiration ?? null,
      fish: documents?.fish ?? null,
      personalId: documents?.personalId ?? null,
      personalIdExpiration: documents?.personalIdExpiration ?? null,
      graduationCertificate: documents?.graduationCertificate ?? null,
      personalPhoto: documents?.personalPhoto ?? null,
      driverLicense: documents?.driverLicense ?? null,
      driverLicenseExpiration: documents?.driverLicenseExpiration ?? null,
      insurance: documents?.insurance ?? null,
      certificate_111: documents?.certificate_111 ?? null,
      toxicityReport: documents?.toxicityReport ?? null,
      kaabAlaamal: documents?.kaabAlaamal ?? null,
      skillMeasurement: documents?.skillMeasurement ?? null
    };

    const hasValidData = Object.values(userDocumentsData).some(
      (value) => value !== null
    );

    if (hasValidData) {
      await this.userDocumentsRepository.save({ user, ...userDocumentsData });
    }
  }

  async getEmployeeTypes(): Promise<EmployeeTypeEntity[]> {
    return this.employeeTypeEntityRepository.find({});
  }

  async createUserByAdmin(createUserDto: CreateUserDto): Promise<User> {
    const user: User = await this.createUser(createUserDto, true);
    await this.payrollsService.createPayrollForUser(user);
    return this.findOneById(user.id);
  }

  async getAllEmployees(query: UsersQueryDto): Promise<User[]> {
    const { limit, page } = query;
    return this.usersRepository.find({
      relations: ['site'],
      where: { isActive: true },
      skip: limit * page,
      take: limit
    });
  }

  async fix() {
    const users: User[] = await this.usersRepository.find({
      relations: ['salaryDetails']
    });

    await Promise.all(
      users.map(async (user: User) => {
        if (!user.salaryDetails) {
          await this.salaryDetailsRepository.save({ user });
        }
      })
    );
  }
}
