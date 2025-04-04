import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ex: "board:create", "user:delete"

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
