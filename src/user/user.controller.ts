import { Controller, Get, Post, Body, Patch, Param, Delete,Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyMulter } from 'src/factory/storgehelper';

export const storage = {
  storage: MyMulter.Storage('./uploads/profileimages')
};
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
  @UseGuards(JwtGuard)
  @Get('myprofile')
    getprofile(@GetUser() user:CreateUserDto,@Res() res){
      delete user.resetExpiresTime
      delete user.resetPasswordToken
      return this.userService.getProfile(user,res)
    }

    @Post('uploadImage')
    @UseInterceptors(FileInterceptor('image', storage))
    uploadFile(@UploadedFile() file, @GetUser('id') userId:any,@Res()res) {

      return this.userService.updatePhoto(userId, file,res);
    }
}
