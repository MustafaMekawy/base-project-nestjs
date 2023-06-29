import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { EmailService } from 'src/common/modules/email/email.service';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt/bcrypt.service';
import { UserService } from '../user/user.service';
import { GoogleStrategy } from './strategy/google-strategy';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    GoogleStrategy,
    BcryptService,
    EmailService,
  ],
})
export class AuthModule {}
