import { promises as fs } from 'fs';

import { Inject, Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';

import { ILogger, LOGGER } from '../../../../shared/logger/ILogger';
import { GenerateTopHundredActiveUsersReportReadModel } from '../../application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportReadModel';
import { IUsersReportGenerator } from '../../application/GenerateTopHundredActiveUsersReport/IUsersReportGenerator';

import type { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import type { ObjectMap } from 'csv-writer/src/lib/lang/object';

@Injectable()
export class CSVUserReportGenerator implements IUsersReportGenerator {
  private readonly csvWriter: CsvWriter<ObjectMap<any>>;
  private readonly csvHeaders = [
    { id: 'userId', title: 'UserId' },
    { id: 'email', title: 'Email' },
    { id: 'registrationDate', title: 'RegistrationDate' },
    { id: 'lastLoginAt', title: 'LastLoginAt' },
    { id: 'loginCount', title: 'LoginCount' },
  ];
  private readonly ROOT_DIRECTORY = 'reports';
  private readonly OUTPUT_FILE_PATH = `${this.ROOT_DIRECTORY}/top_hundred_active_users.csv`;

  public constructor(@Inject(LOGGER) private readonly logger: ILogger) {
    this.csvWriter = createObjectCsvWriter({
      path: this.OUTPUT_FILE_PATH,
      header: this.csvHeaders,
    });
  }

  public async generateTopHundredActiveUsersReport(
    users: GenerateTopHundredActiveUsersReportReadModel[],
  ): Promise<void> {
    console.table(users);

    await fs.mkdir(this.ROOT_DIRECTORY, { recursive: true });

    await this.csvWriter.writeRecords(users);

    this.logger.info(`CSV report generated at: ${this.OUTPUT_FILE_PATH}`);
  }
}
