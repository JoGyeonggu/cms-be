import { Body, Controller, Get, Post } from '@nestjs/common';
import { Menu } from './menu.entity';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() body: Partial<Menu> & { parentId?: number }): Promise<Menu> {
    return this.menusService.create(body);
  }

  @Get('/tree')
  getTree(): Promise<Menu[]> {
    return this.menusService.findMenuTree();
  }

  @Get()
  getAll(): Promise<Menu[]> {
    return this.menusService.findAll();
  }
}
