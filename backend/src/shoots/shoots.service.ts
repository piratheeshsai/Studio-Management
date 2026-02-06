
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShootDto } from './dto/create-shoot.dto';
import { ShootStatus, ShootItemStatus, PaymentMethod } from '../generated/prisma/client';
import { generateShootCode } from './utils/generateShootCode';

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

    // 2. Generate shoot code
    const shootCode = await generateShootCode(this.prisma, pkg.category);

    // 3. Create Shoot and Copy Items
    return this.prisma.$transaction(async (tx) => {
      const shoot = await tx.shoot.create({
        data: {
          shootCode,
          clientId: data.clientId,
          category: pkg.category, // Use category from package (or from dto if overridden allowed)
          packageName: pkg.name,
          finalPrice: data.finalPrice,
          description: data.description,
          eventDate: data.eventDate ? new Date(data.eventDate) : null,
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
      where: {
        deletedAt: null, // Exclude soft-deleted shoots
      },
      include: {
        client: true,
        items: true,
        payments: true,
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
            orderBy: { createdAt: 'asc' },
            include: {
              assignments: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true, role: { select: { name: true } } },
                  },
                },
              },
            },
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

  async remove(id: string) {
    // Soft delete: set deletedAt timestamp instead of actually deleting
    return this.prisma.shoot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================
  // CREW ASSIGNMENT METHODS
  // ============================================

  async assignUserToItem(shootItemId: string, userId: string) {
    return this.prisma.shootItemAssignment.create({
      data: {
        shootItemId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: { select: { name: true } } },
        },
      },
    });
  }

  async unassignUserFromItem(shootItemId: string, userId: string) {
    return this.prisma.shootItemAssignment.deleteMany({
      where: {
        shootItemId,
        userId,
      },
    });
  }

  async getItemAssignments(shootItemId: string) {
    return this.prisma.shootItemAssignment.findMany({
      where: { shootItemId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: { select: { name: true } } },
        },
      },
    });
  }

  async updateItemWithEventDetails(
    itemId: string, 
    data: { 
      status?: ShootItemStatus; 
      dimensions?: string; 
      pages?: number; 
      isIncluded?: boolean;
      eventDate?: string;
      location?: string;
    }
  ) {
    const updateData: any = { ...data };
    if (data.eventDate) {
      updateData.eventDate = new Date(data.eventDate);
    }
    return this.prisma.shootItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: { select: { name: true } } },
            },
          },
        },
      },
    });
  }
}
