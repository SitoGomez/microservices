export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  match(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PasswordHasher');
