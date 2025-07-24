import { Inject } from '@nestjs/common';

import { IQueryHandler } from '../../../../shared/queryBus/IQueryHandler';
import {
  IUserActivityReadLayer,
  USER_ACTIVITY_READ_LAYER,
} from '../IUserActivityReadLayer';

import { GenerateTopHundredActiveUsersReportQuery } from './GenerateTopHundredActiveUsersReportQuery';
import {
  IUsersReportGenerator,
  USERS_REPORT_GENERATOR,
} from './IUsersReportGenerator';

export class GenerateTopHundredActiveUsersReportUseCase
  implements IQueryHandler<GenerateTopHundredActiveUsersReportQuery, void>
{
  private readonly userActivityReadLayer: IUserActivityReadLayer;
  private readonly usersReportGenerator: IUsersReportGenerator;

  public constructor(
    @Inject(USER_ACTIVITY_READ_LAYER)
    userActivityReadLayer: IUserActivityReadLayer,
    @Inject(USERS_REPORT_GENERATOR)
    usersReportGenerator: IUsersReportGenerator,
  ) {
    this.userActivityReadLayer = userActivityReadLayer;
    this.usersReportGenerator = usersReportGenerator;
  }

  public async execute(
    _query: GenerateTopHundredActiveUsersReportQuery,
  ): Promise<void> {
    const users = await this.userActivityReadLayer.getTopHundredActiveUsers();
    return this.usersReportGenerator.generateTopHundredActiveUsersReport(users);
  }
}
