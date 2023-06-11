import { BadRequestException, Injectable } from '@nestjs/common';
import { CRUD } from 'src/factory/crud.factory';
import { ErrorHandler } from 'src/factory/errorHandler';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  //   Find All Categories using crud factory
  async findAllCategories(res) {
    return CRUD.findAll(this.prisma.category,res);
  }

  //   Create new Category
  async createCategory(createCategoryDto: any,res) {
    try {
      // create new category
      return CRUD.create(this.prisma.category,createCategoryDto,res)
    } catch (err) {
      ErrorHandler.createError('Internal Error', 500);
    }
  }

  // Update Category
  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto,res) {
    return CRUD.update(this.prisma.category, id, updateCategoryDto,res);
  }
 async findoneCategoriey(id:string,res){
  try { 
    return CRUD.findOne(this.prisma.category, id,res);
  }
   catch (error) {
    throw error
  }
}
}
