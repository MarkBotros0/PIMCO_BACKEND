import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDocumentsDto } from './user-documents.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  fullname: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  employeeTypeId: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  siteId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDocumentsDto)
  @ApiProperty({ type: () => UserDocumentsDto })
  documents: UserDocumentsDto;
}
