import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fullname?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  dateOfBirth?: Date;
}
