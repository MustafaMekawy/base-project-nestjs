import { MinLength } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    title: string;
    @IsNotEmpty()
    @IsString()
    body: string;
    @IsString()
    userId:string

    categoryName:string
}
