import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone Number must start with "01" followed by digits only.'
  })
  @MaxLength(15, { message: 'maximum phone number length is 15' })
  @MinLength(5, { message: 'minimum phone number length is 5' })
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
