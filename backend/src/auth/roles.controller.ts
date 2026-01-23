import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
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
  createRole(@Body('name') name: string) {
    return this.rolesService.createRole(name);
  }

  @Get()
  @RequirePermissions('USER_READ')
  findAll() {
    return this.rolesService.findAll();
  }

  @Put(':id/permissions')
  @RequirePermissions('USER_DELETE')
  assignPermissions(@Param('id') id: string, @Body('permissions') permissions: string[]) {
    return this.rolesService.assignPermissions(id, permissions);
  }
}
