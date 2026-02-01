
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShootDto } from './dto/create-shoot.dto';
import { ShootStatus, ShootItemStatus, PaymentMethod } from '../generated/prisma/client';

@Injectable()
export class ShootsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateShootDto) {
    // 1. Fetch Package Items
    const pkg = await this.prisma.package.findUnique({
      where: { id: data.packageId },
      include: { items: true },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    // 2. Create Shoot and Copy Items
    return this.prisma.$transaction(async (tx) => {
      const shoot = await tx.shoot.create({
        data: {
          clientId: data.clientId,
          category: pkg.category, // Use category from package (or from dto if overridden allowed)
          packageName: pkg.name,
          finalPrice: data.finalPrice,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : null,
          status: ShootStatus.PENDING,
          items: {
            create: (data.items && data.items.length > 0) 
              ? data.items.map((item) => ({
                  name: item.name,
                  type: item.type,
                  dimensions: item.dimensions,
                  pages: item.pages,
                  quantity: item.quantity || 1,
                  isIncluded: item.isIncluded !== undefined ? item.isIncluded : true,
                  status: ShootItemStatus.DESIGNING,
                  description: item.description,
                }))
              : pkg.items.map((item) => ({
                  name: item.name,
                  type: item.type,
                  dimensions: item.defDimensions,
                  pages: item.defPages,
                  quantity: item.defQuantity || 1,
                  isIncluded: true,
                  status: ShootItemStatus.DESIGNING,
                  description: item.description,
                })),
          },
        },
        include: { items: true },
      });
      return shoot;
    });
  }

  async findAll() {
    return this.prisma.shoot.findMany({
      include: {
        client: true,
        _count: {
            select: { items: true, payments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const shoot = await this.prisma.shoot.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
            orderBy: { createdAt: 'asc' }
        },
        payments: {
            orderBy: { date: 'desc' }
        },
      },
    });

    if (!shoot) throw new NotFoundException('Shoot not found');
    return shoot;
  }

  async updateStatus(id: string, status: ShootStatus) {
    return this.prisma.shoot.update({
        where: { id },
        data: { status }
    })
  }

  async updateItem(itemId: string, data: { status?: ShootItemStatus; dimensions?: string; pages?: number; isIncluded?: boolean }) {
    return this.prisma.shootItem.update({
      where: { id: itemId },
      data,
    });
  }

  async addPayment(shootId: string, data: { amount: number; method: PaymentMethod; note?: string; date?: string }) {
    return this.prisma.payment.create({
      data: {
        shootId,
        amount: data.amount,
        method: data.method,
        note: data.note,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
  }
}
