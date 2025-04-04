import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Role } from './role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role | null> {
    return this.rolesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Role>): Promise<Role> {
    return this.rolesService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(+id);
  }

  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: number[] },
  ): Promise<Role> {
    return this.rolesService.assignPermissions(+id, body.permissionIds);
  }

  @Post(':id/menus')
  assignMenus(
    @Param('id') id: string,
    @Body() body: { menuIds: number[] },
  ): Promise<Role> {
    return this.rolesService.assignMenus(+id, body.menuIds);
  }
}
