import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  workingHrsPerDay: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  contractedDays: number;
}
