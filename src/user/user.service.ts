import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
    if (!id) {
      return `This action returns a #${id} user`;
    }
    return await this.userRepo.findOne({ where: { idUser: id } });
  }
  // GET USER EMAIL EXISTING
  findUserEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
  // GET USER PHONE EXISTING
  findUserPhone1(tel1: string) {
    return this.userRepo.findOne({ where: { tel1 } });
  }
  // GET USER PHONE EXISTING
  findUserPhone2(tel2: string) {
    return this.userRepo.findOne({ where: { tel2 } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
