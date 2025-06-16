import { Inject, Injectable } from '@nestjs/common';

import {
  DOMAIN_EVENT_MANAGER,
  IDomainEventManager,
} from '../../../../../shared/domainEvent/domain/IDomainEventManager';
import { User } from '../../../domain/User';

import { UserEntity } from './entities/User.entity';

@Injectable()
export class MikroOrmUserMapper {
  public constructor(
    @Inject(DOMAIN_EVENT_MANAGER)
    private readonly domainEventManager: IDomainEventManager,
  ) {}

  public fromDomain(user: User): UserEntity {
    const userEntity = new UserEntity(
      user.getId(),
      user.getEmail(),
      user.getPassword(),
      user.getCreatedAt(),
      user.getUpdatedAt(),
    );

    return userEntity;
  }

  public toDomain(userEntity: UserEntity): User {
    return User.fromPrimitives(
      this.domainEventManager,
      userEntity.getUserId(),
      userEntity.getEmail(),
      userEntity.getPassword(),
      userEntity.getCreatedAt(),
      userEntity.getUpdatedAt(),
    );
  }
}
