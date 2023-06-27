import { UserInterface } from './../../../database/models/user.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserInterface => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
