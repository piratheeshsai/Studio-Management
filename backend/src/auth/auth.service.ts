import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Find the role (default to OWNER if not specified or specified role doesn't exist? logic can vary)
    // For now, let's look up the role name.
    const roleName = dto.role || 'OWNER';
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });

    if (!role) {
        throw new BadRequestException(`Role ${roleName} not found`);
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        roleId: role.id,
      },
    });
    
    // Need to re-fetch user with permissions to generate token with permissions
    // Or just fetch role's permissions knowing the role object.
    // Let's generate token.
    return this.generateToken(user, role.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: { include: { permissions: true } } }
    });
    
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.generateToken(user);
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
          id: true, 
          email: true, 
          name: true, 
          role: { select: { name: true, permissions: { select: { slug: true } } } } 
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async generateToken(user: any, roleId?: string) {
      // If user object doesn't have role loaded, we might need to fetch it.
      // But login fetches it. Register has roleId.
      
      let permissions: string[] = [];
      let roleName = '';

      if (user.role && user.role.permissions) {
          permissions = user.role.permissions.map(p => p.slug);
          roleName = user.role.name;
      } else if (user.roleId || roleId) {
           // Fallback if role relation not loaded but we have ID
           const r = await this.prisma.role.findUnique({ 
               where: { id: user.roleId || roleId },
               include: { permissions: true }
           });
           if (r) {
               permissions = r.permissions.map(p => p.slug);
               roleName = r.name;
           }
      }

    const payload = { 
        sub: user.id, 
        email: user.email, 
        role: roleName,
        permissions: permissions 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}