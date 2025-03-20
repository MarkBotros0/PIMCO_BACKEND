import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
