import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { RolesEnum } from 'src/common/enum/roles.enum';
import { BaseAuthDto } from './auth-base.dto';

export class SignupDto extends BaseAuthDto {
  @IsString()
  name: string;

  @IsString()
  passwordConfirm: string;

  @IsPhoneNumber('EG')
  phone: string;

  @IsOptional()
  @IsEnum(RolesEnum)
  role: string;
}
