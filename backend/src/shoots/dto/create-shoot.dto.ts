
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsNumber, Min, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageCategory, PackageItemType } from '../../generated/prisma/client';

export class CreateShootItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(PackageItemType)
  type: PackageItemType;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  pages?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isIncluded?: boolean;
}

export class CreateShootDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsUUID()
  @IsNotEmpty()
  packageId: string;

  @IsEnum(PackageCategory)
  @IsNotEmpty()
  category: PackageCategory;

  @IsString()
  @IsNotEmpty()
  packageName: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  finalPrice: number;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  startDate?: string; // ISO Date string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShootItemDto)
  items?: CreateShootItemDto[];
}

export class UpdateShootStatusDto {
    @IsNotEmpty()
    @IsString()
    status: string; // Will validate against enum in service or use pipe
}
