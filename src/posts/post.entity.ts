import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Board } from '../boards/board.entity';
import { User } from '../users/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ comment: '게시글 고유 ID' })
  id: number;

  @Column({ comment: '게시글 제목' })
  title: string;

  @Column({ type: 'text', comment: '게시글 본문' })
  content: string;

  @ManyToOne(() => Board, (board: Board) => board.posts, { eager: false })
  board: Board;

  @ManyToOne(() => User, (user: User) => user.posts, { eager: false })
  author: User;

  @CreateDateColumn({ comment: '작성일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt: Date;
}
