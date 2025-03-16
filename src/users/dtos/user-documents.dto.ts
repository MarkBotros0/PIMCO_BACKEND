import {
  IsDateString,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDocumentsDto {
  @IsOptional()
  @IsUrl()
  @ApiProperty()
  birthCertificate: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  militaryCertificate: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  militaryCertificateExpiration: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  fish: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  personalId: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  personalIdExpiration: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  graduationCertificate: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  personalPhoto: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  driverLicense: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  driverLicenseExpiration: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  insurance: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  certificate_111: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  toxicityReport: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  kaabAlaamal: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  skillMeasurement: string;
}
