import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
// import * as bcrypt from 'bcrypt';
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

  // FUNCTION TO ENCRYPT PASSWORD
  private async hashPassword({ password }: { password: string }) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }

  // FUNCTION TO COMPARE PASSWORD
  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    // const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    const isPasswordValid = await compare(password, hashedPassword);

    return isPasswordValid;
  }
  // $2b$10$2Q6K9DXFCUL1XdESecHO2OLUmLUlgUPj64YImk
  // FUNCTION REGISTER USER
  async register(authBody: CreateAuthDto): Promise<{ token: string }> {
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
      throw new BadRequestException(
        'CET EMAIL EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }

    // IF PHONE 1 IS USED
    if (isPhone1) {
      throw new BadRequestException(
        'CE NUMERO DE TEL 1 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }
    // IF PHONE 2 IS USED
    if (isPhone2) {
      throw new BadRequestException(
        'CE NUMERO DE TEL 2 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
      );
    }

    // // HASH PASSWORD
    const hashedPassword = await this.hashPassword({ password });
    console.log('hashedPassword', hashedPassword);

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

  // FUNCTION LOGIN USER
  async signin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserEmail(email);

    // IF CHAMPS EMPTY
    if (!email || !password) {
      throw new NotFoundException('LES CHAMPS SONT OBLIGATOIRES');
    }
    // IF USER NOT FOUND
    if (!user) {
      throw new NotFoundException('UTILISATEUR NON TROUVER');
    }
    const isPasswordValid = await compare(password, user.password);
    console.log('USER PASSWORD =======', user.password);
    console.log('PASSWORD =======', password);
    console.log('IS PASSWORD VALID ------ ', isPasswordValid);
    // IF PASSWORD INCORRECT
    if (!isPasswordValid) {
      throw new NotFoundException('LE PASSWORD EST INCORRECT');
    }

    const payload = { sub: user.idUser, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // FUNCTION CHANGE PASSWORD
  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // VERIFY IF CHAMP IS EMPTY
    if (!email || !oldPassword || !newPassword) {
      throw new NotFoundException('CHAMPS REQUIRED...');
    }
    // FIND THE USER
    const user = await this.usersService.findUserEmail(email);
    // Log pour voir si la comparaison réussit
    if (!user) {
      throw new NotFoundException('USER NOT FOUND...');
    }

    // COMPARE THE OLD PASSWORD WITH THE PASSWORD IN DB

    const passwordMatch = await this.isPasswordValid({
      password: oldPassword,
      hashedPassword: user.password,
    });

    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // CHANGE USER'S PASSWORD (DON'T FORGET TO HASH IT!!)
    const newHasedPassword = await this.hashPassword({ password: newPassword });
    user.password = newHasedPassword;
    // SAVE UPDATE PASSWORD
    this.usersService.changePassword(user.idUser, user);

    return {
      message: 'PASSWORD CHANGED WITH SUCCESSFULY...',
    };
  }
}
