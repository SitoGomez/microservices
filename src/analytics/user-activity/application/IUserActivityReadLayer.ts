import { GetTopHundredActiveUsersReadModel } from './GetTopHundredActiveUsers/GetTopHundredActiveUsersReadModel';

export interface IUserActivityReadLayer {
  saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void>;

  getTopHundredActiveUsers(): Promise<GetTopHundredActiveUsersReadModel[]>;
}

export const USER_ACTIVITY_READ_LAYER = Symbol('UserActivityReadLayer');
