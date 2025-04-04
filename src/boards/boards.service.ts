import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  findAll(): Promise<Board[]> {
    return this.boardRepo.find();
  }

  findOne(id: number): Promise<Board> {
    return this.boardRepo.findOneByOrFail({ id });
  }

  async create(data: Partial<Board>): Promise<Board> {
    const board = this.boardRepo.create(data);
    return this.boardRepo.save(board);
  }

  async update(id: number, data: Partial<Board>): Promise<Board> {
    const board = await this.findOne(id);
    Object.assign(board, data);
    return this.boardRepo.save(board);
  }

  async remove(id: number): Promise<void> {
    const board = await this.findOne(id);
    await this.boardRepo.remove(board);
  }
}
