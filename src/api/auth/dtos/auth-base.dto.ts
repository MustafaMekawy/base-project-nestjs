import { IsEmail, IsString, MinLength } from 'class-validator';

export abstract class BaseAuthDto {
  @IsEmail(undefined, { message: 'Please Enter Email!' })
  email: string;

  @IsString({ message: 'Please Enter Password!' })
  @MinLength(8)
  password: string;
}
