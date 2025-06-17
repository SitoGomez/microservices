export class WrongUserCredentialsError extends Error {
  public constructor(email: string) {
    super(`User ${email}} credentials don't match`);
  }
}
