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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  @InjectRepository(UserDocuments)
    private readonly userDocumentsRepository: Repository<UserDocuments>
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
    const user: User = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    return user;
  }

  async create(
    phoneNumber: string,
    data?: Partial<Omit<User, 'phoneNumber'>>
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (user) {
      throw new BadRequestException(
        `User with phone number ${phoneNumber} is already registered`
      );
    }

    return this.usersRepository.save({ phoneNumber, ...data });
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(userId);

    const { phoneNumber,documents, ...updateData } = updateUserDto;

    Object.assign(user, updateData);
    await this.usersRepository.update(user.id, updateData);

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

  async getAllInActiveUsers():Promise<User[]> {
    return this.usersRepository.find({
      relations: ['documents'],
      where:{
        isActive:false
      }
    });
  }

  async acceptUserRequest(userId: number):Promise<void> {
    const user :User = await this.findOneById(userId);
    if (!user || user.isActive){
      throw new BadRequestException("User is already active or didn't send request");
    }
    user.isActive = true;
    await this.usersRepository.save(user);
  }

  async rejectUserRequest(userId: number):Promise<void> {
    const user :User = await this.findOneById(userId);
    if (!user || user.isActive){
      throw new BadRequestException("User is already active or didn't send request");
    }
    await this.usersRepository.delete({ id:user.id });
  }

  async createUserRequest(createUserDto: CreateUserDto) {
    await this.findOneByPhoneNumber(createUserDto.phoneNumber);

    const user:User = await this.usersRepository.save({
      phoneNumber : createUserDto.phoneNumber,
      fullname:createUserDto.fullname,
      dateOfBirth: createUserDto.dateOfBirth ?? null,
    });

    if (createUserDto.documents){
      await this.addDocumentsToUser(createUserDto.documents)
    }
    return user;
  }

  async addDocumentsToUser(documents:UserDocumentsDto):Promise<void> {
    const userDocumentsData = {
      birthCertificate: documents?.birthCertificate ?? null,
      militaryCertificate: documents?.militaryCertificate ?? null,
      militaryCertificateExpiration: documents?.militaryCertificateExpiration ?? null,
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
      skillMeasurement: documents?.skillMeasurement ?? null,
    };

    const hasValidData = Object.values(userDocumentsData).some(value => value !== null);

    if (hasValidData) {
      await this.userDocumentsRepository.save(userDocumentsData);
    }
  }
}
