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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserSerializer } from './UserSerializer';
import { User } from './entities/user.entity';
import { UserRoleGuard } from 'src/guard/user/user.role.guard';
import { Roles } from 'src/decorators/user.roles.decorator';
import { UserRole } from 'src/enum/user_role.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,

    private readonly userService: UserService,
  ) {}

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

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard, UserRoleGuard)
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

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Object> {
    const user: User = req.user;

    // VERIFY FILE FORMAT
    const allowedFromats = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedFromats.includes(file.mimetype)) {
      throw new Error(
        'Format de fichier non supporté. Seuls JPG, JPEG et PNG sont autorisés.',
      );
    }

    // GENERATE UNIQUE NAME
    const uniqueFileName = `${uuidv4()}`;

    // Upload on Cloudinary
    const imageUrl = await this.cloudinaryService.uploadImage(
      file,
      uniqueFileName,
    );

    const updateUser = await this.userService.updateUserImage(
      user.idUser,
      imageUrl,
    );

    return {
      message: 'Image upload successfully',
      imagePath: imageUrl,
      user: updateUser,
    };
  }
}
