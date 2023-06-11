import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CRUD } from 'src/factory/crud.factory';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}

  async findAll(res) {
    return await CRUD.findAll(this.prisma.user,res)
  }

  async findOne (id: string,res) {
      return await CRUD.findOne(this.prisma.user,id,res)

  }

  async update(id: string, updateUserDto: UpdateUserDto,res) {
    return await CRUD.update(this.prisma.user,id,updateUserDto,res)
  }
  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({where:{email}})
  }

  async remove(id: string,res) {
    return await CRUD.delete(this.prisma.user,id,res)
  }
}
