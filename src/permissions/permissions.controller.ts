import { Body, Controller, Get, Post } from '@nestjs/common';
import { Permission } from './permission.entity';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Permission>): Promise<Permission> {
    return this.permissionsService.create(data);
  }
}
