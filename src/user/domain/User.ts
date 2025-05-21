export class User {
  private constructor(
    public id: string,
    public fullname: string,
    public email: string,
    public password: string,
    public createdAt: number,
    public updatedAt: number,
  ) {}

  public static register(
    id: string,
    fullname: string,
    email: string,
    password: string,
    currentTime: number,
  ): User {
    return new User(id, fullname, email, password, currentTime, currentTime);
  }
}
