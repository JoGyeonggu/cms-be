import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

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
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @HttpPost()
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  create(
    @Body() body: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.create(body, files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (typeof body.deleteAttachmentIds === 'string') {
      try {
        const parsed = JSON.parse(body.deleteAttachmentIds);
        body.deleteAttachmentIds = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        body.deleteAttachmentIds = [];
      }
    }

    return this.postsService.update(+id, body, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
