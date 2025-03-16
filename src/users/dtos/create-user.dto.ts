import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDocumentsDto } from './user-documents.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  fullname: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  documents:UserDocumentsDto
}
