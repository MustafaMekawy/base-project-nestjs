import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { RolesEnum } from 'src/factory/enums/roles.enum';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsString()
  passwordConfirm: string;

  @IsPhoneNumber('EG')
  phone: string;

  @IsOptional()
  @IsEnum(RolesEnum)
  role: string;

}
