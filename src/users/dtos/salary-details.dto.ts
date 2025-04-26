import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SalaryDetailsDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  dailySalary?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  incomeTax?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  socialInsurance?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  medical?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  transportationAllowance?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  foodAllowance?: number;
}
