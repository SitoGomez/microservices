import { GetTopHundredActiveUsersReadModel } from '../../../application/GetTopHundredActiveUsers/GetTopHundredActiveUsersReadModel';
import { IUsersReportGenerator } from '../../../application/GetTopHundredActiveUsers/IUsersReportGenerator';

export class UsersReportGeneratorMock implements IUsersReportGenerator {
  private stored: GetTopHundredActiveUsersReadModel[] = [];

  public getStored(): GetTopHundredActiveUsersReadModel[] {
    return this.stored;
  }

  public clean(): void {
    this.stored = [];
  }

  public async generateTopHundredActiveUsersReport(
    users: GetTopHundredActiveUsersReadModel[],
  ): Promise<void> {
    this.stored = users;
    return Promise.resolve();
  }
}
