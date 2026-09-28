import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDecimal,
} from 'class-validator';
import { GenderType, KosType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKosDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty() @IsString() @IsNotEmpty() village: string;
  @ApiProperty() @IsString() @IsNotEmpty() district: string;
  @ApiProperty() @IsString() @IsNotEmpty() regency: string;
  @ApiProperty() @IsString() @IsNotEmpty() province: string;
  @ApiPropertyOptional() @IsString() @IsOptional() postalCode?: string;

  @ApiPropertyOptional() @IsNumber() @IsOptional() latitude?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() longitude?: number;

  @ApiProperty() @IsNumber() @IsNotEmpty() priceFrom: number;
  @ApiProperty() @IsNumber() @IsNotEmpty() priceTo: number;

  @ApiProperty({ enum: GenderType })
  @IsEnum(GenderType)
  @IsNotEmpty()
  genderType: GenderType;
  @ApiPropertyOptional({ enum: KosType })
  @IsEnum(KosType)
  @IsOptional()
  kosType?: KosType;

  @ApiPropertyOptional() @IsString() @IsOptional() rules?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() whatsapp?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  facilities?: string[];

  @ApiPropertyOptional() @IsNumber() @IsOptional() availableRooms?: number;
}
