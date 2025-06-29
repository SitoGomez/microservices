import { GenerateTopHundredActiveUsersReportReadModel } from './GenerateTopHundredActiveUsersReportReadModel';

export interface IUsersReportGenerator {
  generateTopHundredActiveUsersReport(
    users: GenerateTopHundredActiveUsersReportReadModel[],
  ): Promise<void>;
}

export const USERS_REPORT_GENERATOR = Symbol('UsersReportGenerator');
