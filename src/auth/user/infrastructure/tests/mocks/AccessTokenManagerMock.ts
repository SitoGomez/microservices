import {
  AccessTokenData,
  IAccessTokenManager,
} from '../../../domain/IAccessTokenManager';
import { User } from '../../../domain/User';

export class AccessTokenManagerMock implements IAccessTokenManager {
  private accessToken: string | undefined;
  private accessTokenData: AccessTokenData | undefined;

  public setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  public setAccessTokenData(accessTokenData: AccessTokenData): void {
    this.accessTokenData = accessTokenData;
  }

  public clean(): void {
    this.accessToken = undefined;
    this.accessTokenData = undefined;
  }

  public generateAccessTokenFromUser(_user: User): Promise<string> {
    return Promise.resolve(this.accessToken!);
  }

  public verifyAccessToken(_accessToken: string): Promise<AccessTokenData> {
    return Promise.resolve(this.accessTokenData!);
  }
}
