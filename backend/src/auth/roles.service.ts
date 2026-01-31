import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(name: string, permissionSlugs?: string[]) {
    let permissionsConnect: { id: string }[] = [];
    if (permissionSlugs && permissionSlugs.length > 0) {
        const permissions = await this.prisma.permission.findMany({
            where: { slug: { in: permissionSlugs } },
        });
        permissionsConnect = permissions.map(p => ({ id: p.id }));
    }

    try {
        return await this.prisma.role.create({
        data: { 
            name,
            permissions: {
                connect: permissionsConnect
            }
        },
        include: { permissions: true } 
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictException(`Role with name "${name}" already exists`);
        }
        throw error;
    }
  }

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: { 
          permissions: true,
          _count: {
              select: { users: true }
          }
      },
    });
    console.log('RolesService.findAll result:', roles); // DEBUG LOG
    return roles;
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
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

  async getAllPermissions() {
      return this.prisma.permission.findMany();
  }

  async deleteRole(id: string) {
      const role = await this.prisma.role.findUnique({ where: { id } });
      if (role?.name === 'SUPER_ADMIN') {
          throw new Error('Cannot delete Super Admin role');
      }

      // Optional: Check if users are assigned to this role before deleting
      // For now, we allow it (users might fall back to no role or need handling)
      
      return this.prisma.role.delete({
          where: { id },
      });
  }
}
