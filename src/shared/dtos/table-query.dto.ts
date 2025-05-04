import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TableQueryDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty()
  page: number = 0;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty()
  limit: number = 10;
}
