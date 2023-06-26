import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  constructor(private readonly userService: UserService) {}
  updateCurrentUserImage(userId, image) {
    return this.userService.updateUserPhoto(userId, image);
  }
}
