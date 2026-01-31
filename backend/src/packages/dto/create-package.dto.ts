import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageCategory, PackageItemType } from '../../generated/prisma/enums';

export class CreatePackageItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(PackageItemType)
  type: PackageItemType;

  @IsOptional()
  @IsString()
  defDimensions?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defPages?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defQuantity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePackageDto {
  @IsEnum(PackageCategory)
  category: PackageCategory;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageItemDto)
  items: CreatePackageItemDto[];
}
