import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    EmailModule,
    CategoryModule,
    PostModule,
    UserModule
    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
