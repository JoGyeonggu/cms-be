import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'q1w2e3r4',
      database: 'cms_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발 중에만 true
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
})
export class AppModule {}
