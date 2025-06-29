import { GetTopHundredActiveUsersReadModel } from './GetTopHundredActiveUsersReadModel';

export interface IUsersReportGenerator {
  generateTopHundredActiveUsersReport(
    users: GetTopHundredActiveUsersReadModel[],
  ): Promise<void>;
}

export const USERS_REPORT_GENERATOR = Symbol('UsersReportGenerator');
