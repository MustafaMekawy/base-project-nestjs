import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import CrudFactoryHelper from 'src/common/helpers/crud-factory-helper/crud.factory';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(user: CreateUserDto) {
    return await CrudFactoryHelper.create(this.prisma.user, user);
  }
  async findAll() {
    return await CrudFactoryHelper.findAll(this.prisma.user);
  }
  async findOneBy(condition: any) {
    return await CrudFactoryHelper.findOne(this.prisma.user, condition);
  }
  async findOne(id: string) {
    return await CrudFactoryHelper.findOne(this.prisma.user, id);
  }

  async update(condition: any, updateUserDto: any) {
    return await CrudFactoryHelper.update(
      this.prisma.user,
      condition,
      updateUserDto,
    );
  }

  async remove(id: string) {
    return await CrudFactoryHelper.delete(this.prisma.user, id);
  }

  async updateUserPhoto(id: string, image: any) {
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
      const updatedUser = await CrudFactoryHelper.update(
        this.prisma.user,
        { id },
        {
          image: image.path,
        },
      );
      delete updatedUser.refreshToken;
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
