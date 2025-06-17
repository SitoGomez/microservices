import { IPasswordHasher } from '../../../domain/IPasswordHasher';

export class PasswordHasherMock implements IPasswordHasher {
  private toReturnHash: string | undefined;
  private toReturnMatch: boolean | undefined;

  public setHash(hash: string): void {
    this.toReturnHash = hash;
  }

  public setMatch(match: boolean): void {
    this.toReturnMatch = match;
  }

  public clean(): void {
    this.toReturnHash = undefined;
    this.toReturnMatch = undefined;
  }

  public async hash(_: string): Promise<string> {
    return Promise.resolve(this.toReturnHash!);
  }

  public async match(_: string, __: string): Promise<boolean> {
    return Promise.resolve(this.toReturnMatch!);
  }
}
