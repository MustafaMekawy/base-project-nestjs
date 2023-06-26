import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/common/enum/roles.enum';

export const Roles = (...roles: RolesEnum[] | string[]) =>
  SetMetadata('roles', roles);
