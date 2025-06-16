import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { User } from '../../../domain/User';
import { IUserRepository } from '../../../domain/UserRepository';

import { UserEntity } from './entities/User.entity';
import { MikroOrmUserMapper } from './MikroOrmUserMapper';

@Injectable()
export class MikroOrmUserRepository implements IUserRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly userMapper: MikroOrmUserMapper,
  ) {}

  public async register(user: User): Promise<void> {
    await this.userRepository.insert(this.userMapper.fromDomain(user));
  }
}
