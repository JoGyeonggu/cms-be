import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menus/menu.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private permissionsService: PermissionsService,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findOne(id: number): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  create(data: Partial<Role>): Promise<Role> {
    const role = this.rolesRepository.create(data);
    return this.rolesRepository.save(role);
  }

  remove(id: number): Promise<void> {
    return this.rolesRepository.delete(id).then(() => {});
  }

  async assignPermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'], // permission 같이 로드
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    const permissions = await this.permissionsService.findByIds(permissionIds);
    role.permissions = permissions;

    return this.rolesRepository.save(role);
  }

  async assignMenus(roleId: number, menuIds: number[]): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['menus'],
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    const menus = await this.menuRepository.findBy({ id: In(menuIds) });
    role.menus = menus;

    return this.rolesRepository.save(role);
  }
}
