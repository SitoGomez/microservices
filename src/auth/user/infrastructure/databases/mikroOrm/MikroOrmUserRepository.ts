import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { User } from '../../../domain/User';
import { IUserRepository } from '../../../domain/UserRepository';

import { UserEntity } from './entities/User.entity';
import { MikroOrmUserMapper } from './MikroOrmUserMapper';

@Injectable()
export class MikroOrmUserRepository implements IUserRepository {
  private readonly userRepository: EntityRepository<UserEntity>;
  private readonly userMapper: MikroOrmUserMapper;
  private readonly em: EntityManager;

  public constructor(
    userMapper: MikroOrmUserMapper,
    @InjectEntityManager('auth') em: EntityManager,
  ) {
    this.userMapper = userMapper;
    this.em = em;
    this.userRepository = this.em.getRepository(UserEntity);
  }

  public async register(user: User): Promise<void> {
    await this.userRepository.insert(this.userMapper.fromDomain(user));
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return null;
    }

    return this.userMapper.toDomain(user);
  }
}
