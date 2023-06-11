import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@GetUser('id')userId, @Body() createPostDto: CreatePostDto,@Res() res) {
    createPostDto.userId=userId
    return this.postService.create(createPostDto,res);
  }

  @Get()
  findAll(@Res() res) {
    return this.postService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Res() res) {
    return this.postService.findOne(id,res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto,@Res() res) {
    return this.postService.update(id, updatePostDto,res);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() res) {
    return this.postService.remove(id,res);
  }
}
