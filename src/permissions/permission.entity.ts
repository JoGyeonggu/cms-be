import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({ comment: '권한 고유 ID' })
  id: number;

  @Column({ unique: true, comment: '권한 이름 (ex: board:create)' })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
