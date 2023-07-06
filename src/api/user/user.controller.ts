import { ExcelService } from './../../common/modules/files/excel/excel.service';
import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';

import { MyMulter } from 'src/common/helpers/multer/multer.helper';
import { FileSystemHelper } from 'src/common/helpers/file-system/file-system.helper';
import * as path from 'path';

export const storage = {
  storage: MyMulter.Storage('./uploads/profileimages'),
  fileFilter: MyMulter.fileFilter('image/png', 'image/jpg', 'image/jpeg'),
};
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
