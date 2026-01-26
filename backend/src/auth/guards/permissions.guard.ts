import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // User object comes from JwtStrategy: { userId, username, role, permissions: [] }
    if (!user || !user.permissions) {
       console.log('PermissionsGuard: No user or permissions', user); // DEBUG
       return false;
    }

    if (user.role === 'SUPER_ADMIN') {
        return true;
    }

    console.log('PermissionsGuard: User permissions:', user.permissions); // DEBUG
    console.log('PermissionsGuard: Required permissions:', requiredPermissions); // DEBUG

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
    
    if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
