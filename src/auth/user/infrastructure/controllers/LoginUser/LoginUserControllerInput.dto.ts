import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserControllerInputDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
