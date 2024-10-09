import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Verification } from './entities/verification.entity';
import { MoreThan, Repository } from 'typeorm';
import { generateOtp } from './utils/otp.util';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 1;
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Verification)
    private tokenRepository: Repository<Verification>,
  ) {}

  async generateOTP(userId: number, size = 6): Promise<string> {
    const now = new Date();

    const recentToken = await this.tokenRepository.findOne({
      where: {
        userId,
        createAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }

    const otp = generateOtp(size);

    const hashedToken = await hash(otp, this.saltRounds);

    const tokenEntity = this.tokenRepository.create({
      userId,
      token: hashedToken,
      expiresAt: new Date(now.getTime() + 1 * 600 * 1000),
    });

    await this.tokenRepository.delete({ userId });

    await this.tokenRepository.save(tokenEntity);

    return otp;
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validToken = await this.tokenRepository.findOne({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });
    console.log('validToken', validToken);
    console.log(token);
    if (validToken && (await compare(token, validToken.token))) {
      await this.tokenRepository.remove(validToken).catch((e) => {
        throw new InternalServerErrorException(e?.message);
      });
      return true;
    } else {
      console.log('TOKEN VALID IS FALSE...');
      return false;
    }
  }
}
