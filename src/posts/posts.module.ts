import { Attachment } from '../attachments/attachment.entity';
import { AttachmentsModule } from '../attachments/attachments.module';
import { Board } from '../boards/board.entity';
import { Module } from '@nestjs/common';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Board, User, Attachment]),
    AttachmentsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
