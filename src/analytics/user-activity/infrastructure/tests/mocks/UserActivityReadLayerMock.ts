import { GenerateTopHundredActiveUsersReportReadModel } from '../../../application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportReadModel';
import { IUserActivityReadLayer } from '../../../application/IUserActivityReadLayer';

interface UserActivityToReturnData {
  userId: string;
  email: string;
  registrationDate: Date;
  lastLoginAt: Date;
  loginCount: number;
}

interface UserActivityToStoredData {
  userId: string;
  email: string;
  createdAt: Date;
}

export class UserActivityReadLayerMock implements IUserActivityReadLayer {
  private stored: UserActivityToStoredData[] = [];
  private toReturn: UserActivityToReturnData[] = [];

  public getStored(): UserActivityToStoredData[] {
    return this.stored;
  }

  public setToReturn(users: UserActivityToReturnData[]): void {
    this.toReturn = users;
  }

  public clean(): void {
    this.stored = [];
    this.toReturn = [];
  }

  public saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void> {
    this.stored.push({ userId, email, createdAt });
    return Promise.resolve();
  }

  public getTopHundredActiveUsers(): Promise<
    GenerateTopHundredActiveUsersReportReadModel[]
  > {
    return Promise.resolve(this.toReturn);
  }
}
