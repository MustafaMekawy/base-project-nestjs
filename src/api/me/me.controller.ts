import { UserInterface } from './../../database/models/user.interface';
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
  async me(@GetCurrentUser() currentUser: UserInterface) {
    return createResponse('current user', currentUser);
  }
  @Post('uploadImage')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', storage))
  async uploadUserProfileImage(
    @UploadedFile() file,
    @GetCurrentUser('id') currentUserId: string,
  ) {
    const updatedUser = await this.meService.updateCurrentUserImage(
      currentUserId,
      file,
    );
    return createResponse('image uploaded successfully', updatedUser);
  }
}
