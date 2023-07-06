import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/common/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      RolesEnum[] | string[]
    >('roles', [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return this.matchRoles(requiredRoles, user.role);
    // return requiredRoles.some((role) => user.role?.includes(role));
  }
  matchRoles(roles:string[],userRole:string){
    return roles.some(role=>userRole.includes(role))
  }
}
