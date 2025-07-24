import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { GenerateTopHundredActiveUsersReportReadModel } from '../../../application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportReadModel';
import { IUserActivityReadLayer } from '../../../application/IUserActivityReadLayer';

import { UserActivityEntity } from './entities/UserActivity.entity';

@Injectable()
export class MikroOrmUserActivityReadLayer implements IUserActivityReadLayer {
  private readonly userActivityRepository: EntityRepository<UserActivityEntity>;

  public constructor(@InjectEntityManager('analytics') em: EntityManager) {
    this.userActivityRepository = em.getRepository(UserActivityEntity);
  }

  public async saveUserRegistration(
    userId: string,
    email: string,
    createdAt: Date,
  ): Promise<void> {
    const userActivity = new UserActivityEntity(
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

  public async getTopHundredActiveUsers(): Promise<
    GenerateTopHundredActiveUsersReportReadModel[]
  > {
    const users = await this.userActivityRepository.findAll({
      orderBy: { loginCount: 'DESC' },
      limit: 100,
    });

    return users.map((user) => ({
      userId: user.userId,
      email: user.email,
      registrationDate: user.registrationDate,
      lastLoginAt: user.lastLoginAt!,
      loginCount: user.loginCount,
    }));
  }
}
