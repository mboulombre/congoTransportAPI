import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(authBody: CreateAuthDto) {
    const {
      email,
      adress1,
      adress2,
      firstName,
      lastName,
      password,
      tel1,
      tel2,
    } = authBody;

    // SEE IF EMAIL IS USED
    const isEmail = await this.usersService.findUserEmail(email);
    // SEE IF PHONE 1 IS USED
    const isPhone1 = await this.usersService.findUserPhone1(tel1);
    // SEE IF PHONE 2 IS USED
    const isPhone2 = await this.usersService.findUserPhone2(tel2);
    // IF EMAIL IS USED
    if (isEmail) {
      console.log('IS EMAIL -------', isEmail);
      throw new BadRequestException(
        'CET EMAIL EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }

    // IF PHONE 1 IS USED
    if (isPhone1) {
      console.log('IS EMAIL -------', isPhone1);
      throw new BadRequestException(
        'CE NUMERO DE TEL 1 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }
    // IF PHONE 2 IS USED
    if (isPhone2) {
      console.log('IS EMAIL -------', isPhone2);
      throw new BadRequestException(
        'CE NUMERO DE TEL 2 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }

    // // HASH PASSWORD
    const hashedPassword = await hash(password, 10);

    // CREATE A NEW USER AND SAVE IT
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      adress1,
      adress2,
      tel1,
      tel2,
    });

    // RETURN THE USER REGISTERED
    // return user;
    const token = this.jwtService.sign({ idUser: user.idUser });

    return { token };
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserEmail(email);

    const checkPassword = await compare(password, user.password);

    // IF USER NOT FOUND
    if (!user) {
      throw new NotFoundException('UTILISATEUR NON TROUVER');
    }
    // IF PASSWORD INCORRECT
    if (checkPassword) {
      throw new NotFoundException('LE PASSWORD EST INCORRECT');
    }
    // IF CHAMPS EMPTY
    if (!email || !password) {
      throw new NotFoundException('LES CHAMPS SONT OBLIGATOIRES');
    }

    const payload = { sub: user.idUser, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
