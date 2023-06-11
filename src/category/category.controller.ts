import { Controller, Post, UseGuards, Body, Get, Param,Res } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Roles('admin')
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @Res() res) {
    return this.categoryService.createCategory(createCategoryDto,res);
  }

  @Roles('admin')
  @Get()
  findAllCategories( @Res() res) {
    return this.categoryService.findAllCategories(res);
  }

  
  @Get(":id")
  findoneCategoriey(@Param('id') id: string, @Res() res) {
    return this.categoryService.findoneCategoriey(id,res);
  }

  @Roles('admin',)
  @Post('id')
  updateCategories(
    @Param('id') id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto, @Res() res
  ) {
    return this.categoryService.updateCategory(id, UpdateCategoryDto,res);
  }
}
