import { UserInterface } from 'src/database/models/user.interface';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  constructor(private readonly userService: UserService) {}
  updateCurrentUserImage(userId: string, image: File): Promise<UserInterface> {
    return this.userService.updateUserPhoto(userId, image);
  }
}
