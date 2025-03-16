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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
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

    const { phoneNumber, ...updateData } = updateUserDto;

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
}
