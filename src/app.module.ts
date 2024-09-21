import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env', // Chemin vers le fichier .env
      isGlobal: true, // Rendre la config globale
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Injecter le service de config
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'), // Utilisation du ConfigService
        port: config.get<number>('PORT_DATABASE'),
        username: config.get<string>('DB_USERNAME') || 'root',
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME_DATABASE'),
        entities: [__dirname + './**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
