import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserControllerDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
