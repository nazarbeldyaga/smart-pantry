import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль має бути принаймні 8 символів' })
  password: string;
}
