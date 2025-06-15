import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../src/auth/auth.module';
import { SharedModule } from '../src/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
  ],
})
export class AppModule {}
