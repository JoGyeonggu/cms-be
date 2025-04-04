import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ comment: '사용자 고유 ID' })
  id: number;

  @Column({ unique: true, comment: '로그인용 사용자명 (유일값)' })
  username: string;

  @Column({ comment: '비밀번호 (암호화된 값)' })
  password: string;

  @Column({ default: true, comment: '사용자 활성 여부 (true=활성)' })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;
}
