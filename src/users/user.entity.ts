import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;
}
