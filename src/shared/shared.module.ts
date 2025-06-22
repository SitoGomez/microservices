import { Module } from '@nestjs/common';

import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';

@Module({
  providers: [
    {
      provide: DATE_TIME_SERVICE,
      useClass: SystemDateTimeService,
    },
  ],
  exports: [DATE_TIME_SERVICE],
})
export class SharedModule {}
