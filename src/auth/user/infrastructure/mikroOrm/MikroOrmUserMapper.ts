import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/User.entity';
import { User } from '../../domain/User';

@Injectable()
export class MikroOrmUserMapper {
  public fromDomain(user: User): UserEntity {
    const userEntity = new UserEntity(
      user.getId(),
      user.getFullname(),
      user.getEmail(),
      user.getPassword(),
    );

    return userEntity;
  }
}
