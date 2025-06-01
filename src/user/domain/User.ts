export class User {
  private constructor(
    public id: string,
    public fullname: string,
    public email: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public static register(
    id: string,
    fullname: string,
    email: string,
    password: string,
    currentTime: Date,
  ): User {
    return new User(id, fullname, email, password, currentTime, currentTime);
  }
}
