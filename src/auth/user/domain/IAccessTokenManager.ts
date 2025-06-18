import { User } from './User';

export interface AccessTokenData {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface IAccessTokenManager {
  generateAccessTokenFromUser(user: User): Promise<string>;
  verifyAccessToken(accessToken: string): Promise<AccessTokenData>;
}

export const ACCESS_TOKEN_MANAGER = Symbol('AccessTokenManager');
