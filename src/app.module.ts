import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configuration/configuration';
import { PermissionsModule } from './apps/permissions/permissions.module';
import { RolesModule } from './apps/roles/roles.module';
import { UsersModule } from './apps/users/users.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${encodeURIComponent(configService.get<string>('mongo.user'))}:${encodeURIComponent(configService.get<string>('mongo.password'))}@${configService.get<string>('mongo.host')}:${configService.get<string>('mongo.port')}/${configService.get<string>('mongo.database')}?authSource=admin`,
      }),
      inject: [ConfigService],
    }),
    PermissionsModule,
    RolesModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
