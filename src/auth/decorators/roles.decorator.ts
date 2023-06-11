import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../factory/enums/roles.enum';

export const Roles = (...roles: RolesEnum[] | string[]) =>
  SetMetadata('roles', roles);
