import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2, { message: "Ім'я користувача має бути принаймні 2 символи" })
  @MaxLength(21, { message: "Ім'я користувача не може бути довшим за 21 символ" })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль має бути принаймні 8 символів' })
  password: string;
}
