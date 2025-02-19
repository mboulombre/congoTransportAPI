import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  // CREATE USER FUNCTION
  async createUser(createUserDto: CreateAuthDto) {
    return await this.userRepo.save(createUserDto);
  }

  // CHANGE PASSWORD FUNCTION
  async changePassword(id: number, user: CreateAuthDto) {
    return await this.userRepo.update(id, user);
  }

  // CHANGE PASSWORD FUNCTION
  async resetPassword(id: number, user: CreateAuthDto) {
    return await this.userRepo.update(id, user);
  }

  // GET ALL USER FUNCTION
  async findAll() {
    try {
      let getAllUsers = await this.userRepo.find();
      return {
        success: true,
        datas: getAllUsers,
      };
    } catch (error) {}
  }

  // GET ONE BY ID
  async findOneById(id: number) {
    const user = await this.userRepo.findOne({ where: { idUser: id } });

    if (!user) {
      throw new NotFoundException(
        `This action returns a #${user} user is not found`,
      );
    }

    return user;
  }

  async findUserByEmailOrPhone(
    email: string,
    tel1: string,
    tel2: string,
  ): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ email: email }, { tel1: tel1 }, { tel2: tel2 }],
    });
  }

  // UPDATED USER FUNCTION
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('USER NOT FOUND TO UPDATE THERE...');
    }
    // VERIFIED IF USER ACCOUNT IS ACTIF
    if (!user.isVerified) {
      throw new ForbiddenException(
        "VOTRE COMPTE N'EST PAS ENCORE ACTIVÉ. VOUS NE POUVEZ MODIFIER CE COMPTE.",
      );
    }
    await this.userRepo.update(id, updateUserDto);
    return await this.findOneById(user.idUser);
  }
  // REMOVE USER FUNCTION
  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('USER NOT FOUND TO UPDATE THERE...');
    }

    // VERIFIED IF USER ACCOUNT IS ACTIF
    if (!user.isVerified) {
      throw new ForbiddenException(
        "VOTRE COMPTE N'EST PAS ENCORE ACTIVÉ. VOUS NE POUVEZ SUPPRIMER CE COMPTE.",
      );
    }

    await this.userRepo.delete(id);

    return {
      message: `USER ID ${id} WAS DELETED WITH SUCCESSFULY...`,
    };
  }
  // UPLOAD USER IMAGE
  async updateUserImage(userId: number, imageUrl: string) {
    await this.userRepo.update(userId, { userImage: imageUrl });

    await this.userRepo.findOne({ where: { idUser: userId } });
  }
}
