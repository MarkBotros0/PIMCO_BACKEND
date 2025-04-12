import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class UpdatePayrollDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  approvalStatus?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  attendance?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  overtimeInHours?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  dailySalary?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  totalAttendance?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  incomeTax?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  penalties?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  advances?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  socialInsurance?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  totalDeductions?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  medical?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  bonusesAndAllowances?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  transportationAllowance?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  foodAllowance?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  dailyDifference?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  currencyDifference?: number;
}
