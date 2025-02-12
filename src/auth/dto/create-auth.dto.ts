import {
  IsEmail,
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/enum/user_role.enum';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UN PRENOM.' })
  lastName: string;

  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UN NOM.' })
  firstName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'VOUS DEVEZ FOURNIR UN EMAIL.' })
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'VOTRE MOT DE PASSE DOIT FAIRE PLUS DE 6 CARACTERES.',
  })
  password: string;

  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UNE ADRESSE.' })
  adress1: string;

  @IsString()
  adress2: string | null;

  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UN TELEPHONE.' })
  tel1: string;

  @IsString()
  tel2: string | null;
}
