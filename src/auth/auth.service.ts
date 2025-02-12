import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { VerificationService } from 'src/verification/verification.service';
import { MessageService } from 'src/message/message.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private verificationTokenService: VerificationService,
    private emailService: MessageService,
  ) {}

  // FUNCTION TO ENCRYPT PASSWORD
  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await hash(password, 10);

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
    const isPasswordValid = await compare(password, hashedPassword);

    return isPasswordValid;
  }

  // FUNCTION REGISTER USER
  // async register(authBody: CreateAuthDto): Promise<{ message: string }> {
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
      role,
    } = authBody;

    // SEE IF EMAIL IS USED
    // const isEmail = await this.usersService.findUserEmail(email);
    // // SEE IF PHONE 1 IS USED
    // const isPhone1 = await this.usersService.findUserPhone1(tel1);
    // // SEE IF PHONE 2 IS USED
    // const isPhone2 = await this.usersService.findUserPhone2(tel2);
    // // IF EMAIL IS USED
    // if (isEmail) {
    //   throw new BadRequestException(
    //     'CET EMAIL EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
    //   );
    // }

    // // IF PHONE 1 IS USED
    // if (isPhone1) {
    //   throw new BadRequestException(
    //     'CE NUMERO DE TEL 1 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
    //   );
    // }
    // // IF PHONE 2 IS USED
    // if (isPhone2) {
    //   throw new BadRequestException(
    //     'CE NUMERO DE TEL 2 EST DEJA UTILISE VEILLEZ EN ENTRER UN AUTRE',
    //   );
    // }

    const userExisting = await this.usersService.findUserByEmailOrPhone(
      email,
      tel1,
      tel2,
    );

    if (userExisting) {
      throw new BadRequestException(
        'Cet email ou numéro de téléphone est déjà utilisé, veuillez en entrer un autre.',
      );
    }

    // // HASH PASSWORD
    const hashedPassword = await this.hashPassword({ password });

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
      role,
    });
    // TEMPORARILY SAVE USER AND OTP CODE IN DATABASE
    // await this.usersService.storePendingUser({
    //   email,
    //   adress1,
    //   adress2,
    //   firstName,
    //   lastName,
    //   password: hashedPassword,
    //   tel1,
    //   tel2,
    //   role,
    // });
    // SEND OTP CODE IN USER REGISTERED
    this.generateEmailVerification(email);

    // RETURN THE USER REGISTERED
    // return user;
    const token = this.jwtService.sign(
      {
        idUser: user.idUser,
        role: user.role,
      },
      { expiresIn: '7d' },
    );

    return { token };

    // return {
    //   message: 'Un code de vérification a été envoyé à votre adresse e-mail.',
    // };
  }

  // FUNCTION LOGIN USER
  async signin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // const user = await this.usersService.findUserEmail(email);
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');

    // IF CHAMPS EMPTY
    if (!email || !password) {
      throw new NotFoundException('LES CHAMPS SONT OBLIGATOIRES');
    }
    // IF USER NOT FOUND
    if (!user) {
      throw new NotFoundException('UTILISATEUR NON TROUVER');
    }
    const isPasswordValid = await compare(password, user.password);

    // IF PASSWORD INCORRECT
    if (!isPasswordValid) {
      throw new NotFoundException('LE PASSWORD EST INCORRECT');
    }

    const payload = { sub: user.idUser, email: user.email, role: user.role };

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
    // const user = await this.usersService.findUserEmail(email);
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');
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
  // GENERATE EMAIL AND SEND TO EMAIL ACCOUNT
  async generateEmailVerification(email: string) {
    // const user = await this.usersService.findUserEmail(email);
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');
    if (!user) {
      throw new NotFoundException('USER NOT FOUND');
    }

    const otp = await this.verificationTokenService.generateOTP(user.idUser);

    return this.emailService.sendEmail({
      subject: 'MY APP - ACCOUNT VERIFICATION',
      recipients: [
        { name: user.lastName + ' ' + user.firstName, address: user.email },
      ],
      html: `<p>Hi${user.lastName ? ' ' + user.firstName : ''},</p><p>You may verify your MyApp account using the following OTP: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Regards,<br />MyApp</p>`,
    });
  }
  // VERIFY OTP CODE
  async verifyEmail(email: string, token: string, password: string) {
    // const user = await this.usersService.findUserEmail(email);
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');

    if (!user) {
      throw new NotFoundException('USER NOT FOUND');
    }
    // console.log('user', user);
    // console.log('token', token);
    const isValid = await this.verificationTokenService.validateOtp(
      user.idUser,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException('INVALID OR EXPIRED OTP');
    }

    user.password = await this.hashPassword({ password });

    const userRepo = this.usersService.createUser(user);

    return userRepo;
  }

  // FUNCTION RESET PASSWORD
  async resetPassword(resetPasswordDto: ChangePasswordDto) {
    const { email, newPassword, oldPassword } = resetPasswordDto;
    // VERIFY IF CHAMP IS EMPTY
    if (!email || !oldPassword || !newPassword) {
      throw new NotFoundException('CHAMPS REQUIRED...');
    }

    // FIND THE USER
    // const user = await this.usersService.findUserEmail(email);
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');
    if (!user) {
      throw new NotFoundException('USER NOT FOUND...');
    }

    // COMPARE THE OLD PASSWORD WITH THE PASSWORD IN DB
    const passwordMatch = await this.isPasswordValid({
      password: oldPassword,
      hashedPassword: user.password,
    });

    if (!passwordMatch) {
      throw new UnauthorizedException('WRONG CREDENTIALS');
    }

    // RESET USER PASSWORD
    user.password = await this.hashPassword({ password: newPassword });

    // RESET PASSWORD
    this.usersService.changePassword(user.idUser, user);

    return {
      message: 'PASSWORD RESET WITH SUCCESSFULY...',
    };
  }
}
