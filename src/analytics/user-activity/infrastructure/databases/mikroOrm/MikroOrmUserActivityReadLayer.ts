import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { IUserActivityReadLayer } from '../../../application/IUserActivityReadLayer';

import { UserActivity } from './entities/UserActivity.entity';

@Injectable()
export class MikroOrmUserActivityReadLayer implements IUserActivityReadLayer {
  public constructor(
    @InjectRepository(UserActivity, 'analytics')
    private readonly userActivityRepository: EntityRepository<UserActivity>,
  ) {}

  public async saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void> {
    const userActivity = new UserActivity(
      userId,
      email,
      createdAt,
      undefined,
      0,
      createdAt,
      createdAt,
    );

    await this.userActivityRepository.insert(userActivity);
  }
}
