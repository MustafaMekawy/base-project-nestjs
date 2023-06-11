import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name:string
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password:string
    @IsPhoneNumber('EG')
    phone: string;
}
