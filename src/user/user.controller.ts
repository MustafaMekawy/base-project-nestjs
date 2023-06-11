import { Controller, Get, Post, Body, Patch, Param, Delete,Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll( @Res() res) {
    return this.userService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res) {
    return this.userService.findOne(id,res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    return this.userService.update(id, updateUserDto,res);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res) {
    return this.userService.remove(id,res);
  }
}
