import { IsJWT, IsNotEmpty } from 'class-validator';

export class LoginUserControllerOutputDto {
  @IsJWT()
  @IsNotEmpty()
  public readonly access_token: string;

  public constructor(accessToken: string) {
    this.access_token = accessToken;
  }
}
