import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { IUserActivityReadLayer } from '../../../application/IUserActivityReadLayer';

import { UserActivity } from './entities/UserActivity.entity';

@Injectable()
export class MikroOrmUserActivityReadLayer implements IUserActivityReadLayer {
  private readonly userActivityRepository: EntityRepository<UserActivity>;

  public constructor(
    @InjectEntityManager('analytics') private readonly em: EntityManager,
  ) {
    this.userActivityRepository = this.em.getRepository(UserActivity);
  }

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
