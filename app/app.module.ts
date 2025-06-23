import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AnalyticsModule } from '../src/analytics/analytics.module';
import { AuthModule } from '../src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
    ]),
    AnalyticsModule,
  ],
})
export class AppModule {}
