import { GenerateTopHundredActiveUsersReportReadModel } from './GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportReadModel';

export interface IUserActivityReadLayer {
  saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void>;

  getTopHundredActiveUsers(): Promise<
    GenerateTopHundredActiveUsersReportReadModel[]
  >;
}

export const USER_ACTIVITY_READ_LAYER = Symbol('UserActivityReadLayer');
