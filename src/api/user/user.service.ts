import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import CrudFactoryHelper from 'src/common/helpers/crud-factory-helper/crud.factory';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await CrudFactoryHelper.findAll(this.prisma.user);
  }

  async findOne(id: string) {
    return await CrudFactoryHelper.findOne(this.prisma.user, id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await CrudFactoryHelper.update(this.prisma.user, id, updateUserDto);
  }
  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async remove(id: string) {
    return await CrudFactoryHelper.delete(this.prisma.user, id);
  }

  async updateUserPhoto(id, image) {
    try {
      if (
        image.mimetype != 'image/png' &&
        image.mimetype &&
        'image/jpg' &&
        image.mimetype != 'image/jpeg'
      ) {
        throw new BadRequestException(
          'Only .png, .jpg and .jpeg format allowed!',
        );
      }
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          image: image.path,
        },
      });
      return { image: user.image };
    } catch (error) {
      throw error;
    }
  }
}
