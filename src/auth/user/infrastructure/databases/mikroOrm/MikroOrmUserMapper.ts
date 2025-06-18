import { Injectable } from '@nestjs/common';

import { User } from '../../../domain/User';

import { UserEntity } from './entities/User.entity';

@Injectable()
export class MikroOrmUserMapper {
  public constructor() {}

  public fromDomain(user: User): UserEntity {
    const userEntity = new UserEntity(
      user.getUserId(),
      user.getEmail(),
      user.getPassword(),
      user.getCreatedAt(),
      user.getUpdatedAt(),
    );

    return userEntity;
  }

  public toDomain(userEntity: UserEntity): User {
    return User.fromPrimitives(
      userEntity.getUserId(),
      userEntity.getEmail(),
      userEntity.getPassword(),
      userEntity.getCreatedAt(),
      userEntity.getUpdatedAt(),
    );
  }
}
