import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './guard/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async create(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.register(createAuthDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() sigInDto: AuthUserDto) {
    return await this.authService.signin(sigInDto.email, sigInDto.password);
  }

  @UseGuards(AuthGuard)
  @Put('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(
      changePasswordDto.email,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('verify-otp')
  async generateEmailVerification(@Body() body: { email: string }) {
    return await this.authService.generateEmailVerification(body.email);
  }

  @Post('verify/:otp')
  async verifyEmail(
    @Param('otp') otp: string,
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.verifyEmail(
      body.email,
      otp,
      body.password,
    );

    return { status: result ? 'success' : 'Failure', message: null };
  }

  @UseGuards(AuthGuard)
  @Put('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ChangePasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
