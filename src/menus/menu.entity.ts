import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

import { Role } from '../roles/role.entity';

@Tree('closure-table')
@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn({ comment: '메뉴 고유 ID' })
  id: number;

  @Column({ comment: '메뉴 이름 (ex: 공지사항, 갤러리)' })
  name: string;

  @Column({ comment: 'URL 경로 (ex: /admin/notice)' })
  path: string;

  @Column({ default: false, comment: '관리자용 메뉴 여부' })
  isAdmin: boolean;

  @TreeChildren()
  children: Menu[];

  @TreeParent()
  parent: Menu;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];
}
