import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UN PRENOM.' })
  lastName: string;

  @IsNotEmpty()
  @IsString({ message: 'VOUS DEVEZ FOURNIR UN NOM.' })
  firstName: string;

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
