import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserSerializer } from './UserSerializer';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from 'src/guard/user/user.role.guard';
import { Roles } from 'src/decorators/user.roles.decorator';
import { UserRole } from 'src/enum/user_role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.userService.create(createUserDto);
    return 'this.userService.create(createUserDto)';
  }

  // GET USER INFORMATION
  @UseGuards(AuthGuard)
  @Get('/profile')
  // async getProfile(@CurrentUser() user: User) {
  //   return user;
  // }
  async getProfile(@Request() req: any) {
    return UserSerializer.serialize(
      // await this.userService.findUserEmail(req.user.email),
      await this.userService.findUserByEmailOrPhone(
        req.user.email,
        req.user.tel1,
        req.user.tel2,
      ),
    );
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.userService.findOne(+id);
    return this.userService.findOneById(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  //   @UseGuards(JwtAuthGuard, UserRoleGuard)
  // @Roles(UserRole.ADMIN) // Exemple d'utilisation du décorateur
  // @Get('protected-route')
  // async getProtectedResource() {
  //   return 'Access granted!';
  // }

  // @UseGuards(AuthGuard, UserRoleGuard)
  // @Roles(UserRole.Admin)
  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
