import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'VOUS DEVEZ FOURNIR UN EMAIL.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'VOTRE NOUVEAU MOT DE PASSE DOIT FAIRE PLUS DE 6 CARACTERES.',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'VOTRE ANCIEN MOT DE PASSE DOIT FAIRE PLUS DE 6 CARACTERES.',
  })
  confirmPassword: string;
}
