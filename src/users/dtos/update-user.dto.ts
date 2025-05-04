import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SalaryDetailsDto } from './salary-details.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryDetailsDto)
  @ApiProperty({ type: () => SalaryDetailsDto })
  salaryDetails?: SalaryDetailsDto;
}
