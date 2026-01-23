import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(name: string) {
    return this.prisma.role.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async assignPermissions(roleId: string, permissionSlugs: string[]) {
    // First clear existing permissions or just add? 
    // Usually "update" means "set these".
    // We need permission IDs.
    const permissions = await this.prisma.permission.findMany({
      where: { slug: { in: permissionSlugs } },
    });
    
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissions.map(p => ({ id: p.id })),
        },
      },
      include: { permissions: true },
    });
  }
}
