import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {

    try {
      if (payload.exp < Date.now()) {
        throw new UnauthorizedException('Token has expired');
      }
      const currentUser = await this.userService.findOneBy({
        id: payload.userId,
        email: payload.email,
      });

      if (!currentUser) {
        throw new UnauthorizedException(
          'You are not logged in, please login and try again!',
        );
      }
      delete currentUser.password;
      delete currentUser.refreshToken;
      return currentUser;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Internal Error!');
      }
      throw err;
    }
  }
}
