
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { PackageCategory } from '../../generated/prisma/client';

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
}

export class UpdateShootStatusDto {
    @IsNotEmpty()
    @IsString()
    status: string; // Will validate against enum in service or use pipe
}
