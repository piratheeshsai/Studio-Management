import { Controller, Post, Body, Get, UseGuards, Param, Delete, ForbiddenException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/permissions.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('USER_CREATE')
  @Post('users')
  async createUser(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('USER_READ')
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('USER_DELETE')
  @Post('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.authService.deactivateUser(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('USER_DELETE')
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    // Extra security: Only SUPER_ADMIN can perform hard delete
    if (req.user.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Only Super Admin can delete users permenantly');
    }
    return this.authService.deleteUser(id);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@CurrentUser() user: any, @Body() dto: { password: string }) {
    return this.authService.changePassword(user.userId, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
