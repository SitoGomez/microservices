export class RegisterUserCommand {
  constructor(
    public id: string,
    public fullname: string,
    public email: string,
    public password: string,
  ) {}
}
