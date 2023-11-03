import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @IsString()
  @MinLength(5, { message: 'Password minimum character should be 5.' })
  password: string;
}
