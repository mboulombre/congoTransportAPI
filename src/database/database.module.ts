import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports:[TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService ) => ({
        type: 'mysql',
        host: config.getOrThrow("MYSQL_HOST") || 'localhost',
        port: config.getOrThrow("MYSQL_PORT") || 3306,
        username: config.getOrThrow("MYSQL_USERNAME") || 'root',
        password: config.getOrThrow("MYSQL_PASSWORD") || '',
        database: config.getOrThrow("MYSQL_DATABASE") || 'mydb',
        autoLoadEntities: true,
        synchronize: config.getOrThrow("MYSQL_SYNCHRONIZE") || true,

    }),
    inject: [ConfigService]
})],
exports: [],
})
export class DatabaseModule {}
