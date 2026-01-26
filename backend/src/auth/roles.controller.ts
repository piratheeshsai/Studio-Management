import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/permissions.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('USER_DELETE') // Restricted to Super Admin effectively
  createRole(@Body('name') name: string, @Body('permissions') permissions?: string[]) {
    return this.rolesService.createRole(name, permissions);
  }

  @Get()
  @RequirePermissions('USER_READ')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @RequirePermissions('ROLE_READ')
  listPermissions() {
      return this.rolesService.getAllPermissions();
  }

  @Get(':id')
  @RequirePermissions('ROLE_READ')
  findOne(@Param('id') id: string) {
      return this.rolesService.findOne(id);
  }

  @Delete(':id')
  @RequirePermissions('ROLE_DELETE')
  deleteRole(@Param('id') id: string) {
      return this.rolesService.deleteRole(id);
  }
}

