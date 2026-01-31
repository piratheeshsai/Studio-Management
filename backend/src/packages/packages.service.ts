import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package as PackageModel } from '../generated/prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto): Promise<PackageModel> {
    return this.prisma.$transaction(async (prisma) => {
      // Create the package with items
      const packageData = await prisma.package.create({
        data: {
          category: createPackageDto.category,
          name: createPackageDto.name,
          description: createPackageDto.description,
          basePrice: createPackageDto.basePrice,
          items: {
            create: createPackageDto.items.map((item) => ({
              name: item.name,
              type: item.type,
              defDimensions: item.defDimensions,
              defPages: item.defPages,
              defQuantity: item.defQuantity,
              description: item.description,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return packageData;
    });
  }

  async findAll(): Promise<PackageModel[]> {
    return this.prisma.package.findMany({
      where: {
        deletedAt: null, // Only non-deleted packages
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<PackageModel | null> {
    return this.prisma.package.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });
  }

  async update(id: string, updateData: Partial<CreatePackageDto>): Promise<PackageModel> {
    // First delete existing items, then update package with new items
    const existingPackage = await this.prisma.package.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingPackage) {
      throw new Error('Package not found');
    }

    // Delete existing items
    await this.prisma.packageItem.deleteMany({
      where: { packageId: id },
    });

    // Update package with new data
    return this.prisma.package.update({
      where: { id },
      data: {
        category: updateData.category,
        name: updateData.name,
        description: updateData.description,
        basePrice: updateData.basePrice,
        items: updateData.items
          ? {
              create: updateData.items.map((item) => ({
                name: item.name,
                type: item.type,
                defDimensions: item.defDimensions,
                defPages: item.defPages,
                defQuantity: item.defQuantity,
                description: item.description,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    // Hard delete - permanently remove from database
    await this.prisma.package.delete({
      where: { id },
    });
  }
}
