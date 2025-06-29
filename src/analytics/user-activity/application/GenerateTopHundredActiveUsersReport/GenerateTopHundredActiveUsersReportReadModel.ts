export class GenerateTopHundredActiveUsersReportReadModel {
  public constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly registrationDate: Date,
    public readonly lastLoginAt: Date,
    public readonly loginCount: number,
  ) {}
}
