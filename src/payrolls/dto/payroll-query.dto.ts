import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PayrollQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  nameSearch?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false })
  siteId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false })
  month?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false })
  year?: number;
}
