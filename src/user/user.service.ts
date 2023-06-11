import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CRUD } from 'src/factory/crud.factory';
import { ResponseController } from 'src/factory/response.controller';

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
  async getProfile(user,res){
    return ResponseController.success(res,"your profile",user)
  }

  async updatePhoto(id,image,res){
    try {
        if (image.mimetype != "image/png" && image.mimetype && "image/jpg" && image.mimetype != "image/jpeg"){
            throw new BadRequestException('Only .png, .jpg and .jpeg format allowed!')
        }
        const user= await this.prisma.user.update({
            where:{
                id,
            },
            data:{
                image:image.path,
            }
        })
        return ResponseController.success(res,"image updated",{image:user.image})
        
    } catch (error) {
        
        throw error
    }
}
}
