import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail(undefined, { message: 'Please Enter Email!' })
  email: string;

  @IsString({ message: 'Please Enter Password!' })
  password: string;
}
