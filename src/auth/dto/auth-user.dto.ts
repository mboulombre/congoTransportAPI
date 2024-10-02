import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'VOTRE MOT DE PASSE DOIT FAIRE PLUS DE 6 CARACTERES.',
  })
  password: string;
}
