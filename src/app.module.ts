import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { UserRoleGuard } from './guard/user/user.role.guard';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { VerificationModule } from './verification/verification.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CloudinaryConfig } from './cloudinary/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Chemin vers le fichier .env
      isGlobal: true, // Rendre la config globale
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    VerificationModule,
    MessageModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryConfig,
    // {
    //   provide: APP_GUARD,
    //   useClass: UserRoleGuard,
    // },
  ],
  exports: [CloudinaryConfig],
})
export class AppModule {}
