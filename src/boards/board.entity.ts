import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from '../posts/post.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn({ comment: '게시판 고유 ID' })
  id: number;

  @Column({ unique: true, comment: '게시판 고유 코드(slug)' })
  code: string; // 예: 'notice', 'gallery'

  @Column({ comment: '게시판 이름(한글)' })
  name: string;

  @Column({ default: true, comment: '활성 여부' })
  isActive: boolean;

  @OneToMany(() => Post, (post: Post) => post.board)
  posts: Post[];
}
