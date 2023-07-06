import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ExcelModule } from 'src/common/modules/files/excel/excel.module';

@Module({
  imports: [ExcelModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
