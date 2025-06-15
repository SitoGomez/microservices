import { Injectable } from '@nestjs/common';

import { User } from '../../domain/User';

import { UserEntity } from './entities/User.entity';

@Injectable()
export class MikroOrmUserMapper {
  public fromDomain(user: User): UserEntity {
    const userEntity = new UserEntity(
      user.getId(),
      user.getEmail(),
      user.getPassword(),
    );

    return userEntity;
  }
}
