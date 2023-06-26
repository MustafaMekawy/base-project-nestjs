import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [MeController],
  providers: [MeService, UserService, PrismaService],
})
export class MeModule {}
