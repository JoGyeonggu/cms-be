import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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

  async findAll(boardCode?: string, page = 1, limit = 10, keyword?: string) {
    const where: FindOptionsWhere<Post> = {};

    if (boardCode) {
      where.board = { code: boardCode } as unknown as Board;
    }
    if (keyword) {
      where.title = ILike(`%${keyword}%`);
    }

    const [data, total] = await this.postRepo.findAndCount({
      relations: ['board', 'author'],
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
