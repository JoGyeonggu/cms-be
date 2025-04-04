import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  create(data: Partial<Permission>): Promise<Permission> {
    const perm = this.permissionsRepository.create(data);
    return this.permissionsRepository.save(perm);
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    return this.permissionsRepository.findBy({ id: In(ids) }); // Use the imported In function
  }
}
