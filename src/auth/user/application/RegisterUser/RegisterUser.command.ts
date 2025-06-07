export class RegisterUserCommand {
  public readonly id: string;

  public constructor(
    public readonly userId: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    this.id = crypto.randomUUID();
  }
}
