export class GenerateTopHundredActiveUsersReportReadModel {
  public readonly userId: string;
  public readonly email: string;
  public readonly registrationDate: Date;
  public readonly lastLoginAt: Date;
  public readonly loginCount: number;

  public constructor(
    userId: string,
    email: string,
    registrationDate: Date,
    lastLoginAt: Date,
    loginCount: number,
  ) {
    this.userId = userId;
    this.email = email;
    this.registrationDate = registrationDate;
    this.lastLoginAt = lastLoginAt;
    this.loginCount = loginCount;
  }
}
