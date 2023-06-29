import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { BaseAuthDto } from 'src/api/auth/dtos/auth-base.dto';
import { RolesEnum } from 'src/common/enum/roles.enum';

export class CreateUserDto extends BaseAuthDto {
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
