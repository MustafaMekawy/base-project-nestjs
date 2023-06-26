import { JwtGuard } from './../auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MeService } from './me.service';

import { createResponse } from 'src/common/helpers/response/create-response.helper';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../user/user.controller';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}
  @Get()
  @UseGuards(JwtGuard)
  async me(@GetCurrentUser() currentUser: any) {
    return createResponse('current user', currentUser);
  }
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image', storage))
  async uploadUserProfileImage(
    @UploadedFile() file,
    @GetCurrentUser('id') currentUser: any,
  ) {
    return this.meService.updateCurrentUserImage(currentUser, file);
  }
}
