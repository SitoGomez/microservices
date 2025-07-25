import { Inject, Injectable } from '@nestjs/common';

import {
  IProcessedCommandService,
  PROCESSED_COMMAND_SERVICE,
} from './IProcessedCommandService';

@Injectable()
export class CleanCommandsProcessedProcess {
  private readonly processedCommandService: IProcessedCommandService;

  public constructor(
    @Inject(PROCESSED_COMMAND_SERVICE)
    processedCommandService: IProcessedCommandService,
  ) {
    this.processedCommandService = processedCommandService;
  }

  public async cleanUpCommandsOlderThanSevenDays(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.processedCommandService.deleteOlderThan(sevenDaysAgo);
  }
}
