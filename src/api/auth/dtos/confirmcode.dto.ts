import { IsString } from 'class-validator';

export class ConfirmCodeDto {
  @IsString()
  code: string;
}
