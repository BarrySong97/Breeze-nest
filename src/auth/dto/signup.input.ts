import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupInput {
  @IsEmail()
  email: string;

  avatar: string;

  googleId: string;

  firstname?: string;

  lastname?: string;
}
