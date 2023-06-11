import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CRUD } from 'src/factory/crud.factory';

@Injectable()
export class PostService {
  constructor(private prisma:PrismaService){}
  create(createPostDto: CreatePostDto,res) { 
       return CRUD.create(this.prisma.post,createPostDto,res);
  }

  findAll(res) {
    return CRUD.findAll(this.prisma.post,res);

  }

  findOne(id: string,res) {
    return CRUD.findOne(this.prisma.post,id,res);

  }

  update(id: string, updatePostDto: UpdatePostDto,res) {
    return CRUD.update(this.prisma.post,id,updatePostDto,res);
  }

  remove(id: string,res) {
    return CRUD.delete(this.prisma.post,id,res);

  }
}
