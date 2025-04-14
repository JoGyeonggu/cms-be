import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('board') boardCode?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.postsService.findAll(
      boardCode,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @HttpPost()
  create(@Body() body: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<PostEntity>,
  ): Promise<PostEntity> {
    return this.postsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(+id);
  }
}
