import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsNumberString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RolesEnum } from 'src/common/enum/roles.enum';
import { BaseAuthDto } from './auth-base.dto';

export class SignupDto extends BaseAuthDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber('EG')
  phone: string;

  @IsOptional()
  @IsEnum(RolesEnum)
  role: string;
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNumberString()
  @Length(14)
  nationalId: string;
}
