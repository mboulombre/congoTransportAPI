import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/message/message.service';
import { VerificationModule } from 'src/verification/verification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), VerificationModule],
  controllers: [UserController],
  providers: [UserService, AuthService, MessageService],
  exports: [UserService],
})
export class UserModule {}
