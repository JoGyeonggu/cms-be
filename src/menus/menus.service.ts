import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Menu } from './menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: TreeRepository<Menu>,
  ) {}

  async create(data: Partial<Menu> & { parentId?: number }): Promise<Menu> {
    const menu = this.menuRepository.create(data);

    if (data.parentId) {
      const parent = await this.menuRepository.findOne({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new NotFoundException('부모 메뉴가 존재하지 않습니다.');
      }
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  async findMenuTree(): Promise<Menu[]> {
    return this.menuRepository.findTrees();
  }

  findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }
}
