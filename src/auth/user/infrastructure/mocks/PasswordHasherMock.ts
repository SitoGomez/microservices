import { IPasswordHasher } from '../../domain/IPasswordHasher';

export class PasswordHasherMock implements IPasswordHasher {
  private toReturn: string | undefined;

  public setHash(toReturn: string): void {
    this.toReturn = toReturn;
  }

  public clean(): void {
    this.toReturn = undefined;
  }

  public async hash(_: string): Promise<string> {
    // Mock implementation: just return the password as is for testing purposes
    return Promise.resolve(this.toReturn!);
  }
}
