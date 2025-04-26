import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDocumentsDto } from './user-documents.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SalaryDetailsDto } from './salary-details.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDocumentsDto)
  @ApiProperty({ type: () => UserDocumentsDto })
  salaryDetails?: SalaryDetailsDto;
}
