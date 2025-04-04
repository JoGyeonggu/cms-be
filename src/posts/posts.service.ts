import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../boards/board.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepo.find({
      relations: ['board', 'author'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['board', 'author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async create(data: CreatePostDto): Promise<Post> {
    const board = await this.boardRepo.findOneByOrFail({ id: data.boardId });
    const author = await this.userRepo.findOneByOrFail({ id: data.authorId });

    const post = this.postRepo.create({
      title: data.title,
      content: data.content,
      board,
      author,
    });
    return this.postRepo.save(post);
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, data);
    return this.postRepo.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }
}
