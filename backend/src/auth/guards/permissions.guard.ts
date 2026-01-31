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
    if (!user) {
       console.log('PermissionsGuard: No user found'); // DEBUG
       return false;
    }

    // Check for Super Admin (handle both casing conventions) - PRIORITIZE THIS CHECK
    if (['SUPER_ADMIN', 'Super Admin'].includes(user.role)) {
        return true;
    }

    if (!user.permissions) {
       console.log('PermissionsGuard: No permissions found for user', user); // DEBUG
       return false;
    }

    console.log('PermissionsGuard: User role is:', user.role); // DEBUG
    console.log('PermissionsGuard: User permissions:', user.permissions); // DEBUG
    console.log('PermissionsGuard: Required permissions:', requiredPermissions); // DEBUG

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
    
    if (!hasPermission) {
        console.log('PermissionsGuard: Access denied for user:', user.email); // DEBUG
        throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
