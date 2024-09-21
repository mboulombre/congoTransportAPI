import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dirname } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env', // Chemin vers le fichier .env
      isGlobal: true, // Rendre la config globale
    }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
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
  // imports: [
  //   useFactory: ((config: ConfigService) => (
  //     TypeOrmModule.forRoot({
  //       type: 'mysql',
  //       host: process.env.DB_HOST || 'localhost',
  //       port: +process.env.PORT_DATABASE || 3306,
  //       username: process.env.DB_USERNAME || 'root',
  //       // password: 'root',
  //       password: process.env.DB_PASSWORD || '',
  //       database: process.env.DB_NAME_DATABASE || 'mydb',
  //       entities: [],
  //       synchronize: true,
  //     }),
  //   ),
  // Inject: [ConfigService]
  // ),
  //   ConfigModule.forRoot({
  //     envFilePath: '../.env',
  //     isGlobal: true
  //   })
  // ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
