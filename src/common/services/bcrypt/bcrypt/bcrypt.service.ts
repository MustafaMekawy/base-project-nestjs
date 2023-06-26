import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptService {
  saltNumber: number = process.env.SALT_NUMBER ? +process.env.SALT_NUMBER : 8;
  async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltNumber);
  }
  async comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}
