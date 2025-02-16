import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { VerificationService } from 'src/verification/verification.service';
import { MessageService } from 'src/message/message.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  async register(authBody: CreateAuthDto): Promise<{ message: string }> {
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

    const userExisting = await this.usersService.findUserByEmailOrPhone(
      email,
      tel1,
      tel2,
    );

    if (userExisting) {
      throw new BadRequestException(
        'Cet email ou numéro de téléphone 1 ou 2 est déjà utilisé, veuillez en entrer un autre.',
      );
    }

    // // HASH PASSWORD
    const hashedPassword = await this.hashPassword({ password });

    // CREATE A NEW USER AND SAVE IT
    await this.usersService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      adress1,
      adress2,
      tel1,
      tel2,
      role,
      isVerified: false,
    });

    // SEND OTP CODE IN USER REGISTERED
    this.generateEmailVerification(email);

    return {
      message: 'Un code de vérification a été envoyé à votre adresse e-mail.',
    };
  }

  // FUNCTION LOGIN USER
  async signin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');

    // IF CHAMPS EMPTY
    if (!email || !password) {
      throw new NotFoundException('LES CHAMPS SONT OBLIGATOIRES');
    }
    // IF USER NOT FOUND
    if (!user) {
      throw new NotFoundException('UTILISATEUR NON TROUVER');
    }

    // VERIFIED IF USER ACCOUNT IS ACTIF
    if (!user.isVerified) {
      throw new ForbiddenException(
        "VOTRE COMPTE N'EST PAS ENCORE ACTIVÉ. VEUILLEZ VÉRIFIER VOTRE EMAIL AVEC LE CODE OTP.",
      );
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
  async verifyEmail(email: string, token: string) {
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');

    if (!user) {
      throw new NotFoundException('USER NOT FOUND');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      user.idUser,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException('INVALID OR EXPIRED OTP');
    }

    user.isVerified = true;

    const userRepo = await this.usersService.createUser(user);

    // GENERATE A TOKEN
    const generateTtoken = this.jwtService.sign(
      {
        idUser: userRepo.idUser,
        role: userRepo.role,
      },
      { expiresIn: '7d' },
    );

    return { token: generateTtoken, user: userRepo };
  }

  // FUNCTION RESET PASSWORD
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, confirmPassword } = resetPasswordDto;

    // VERIFY IF CHAMP IS EMPTY
    if (!email || !confirmPassword || !newPassword) {
      throw new NotFoundException('CHAMPS REQUIRED...');
    }

    // VERIFY IF CHAMP IS EMPTY
    if (newPassword !== confirmPassword) {
      throw new NotFoundException(
        `${newPassword} AND ${confirmPassword} CANNOT THE SAME`,
      );
    }

    // FIND THE USER
    const user = await this.usersService.findUserByEmailOrPhone(email, '', '');
    if (!user) {
      throw new NotFoundException('USER NOT FOUND...');
    }

    // RESET USER PASSWORD
    user.password = await this.hashPassword({ password: newPassword });

    // RESET PASSWORD
    this.usersService.resetPassword(user.idUser, user);

    return {
      message: 'PASSWORD RESET WITH SUCCESSFULY...',
    };
  }
}
