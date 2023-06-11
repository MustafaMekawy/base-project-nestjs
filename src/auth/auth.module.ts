import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/strategy';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, EmailService],
})
export class AuthModule {}
