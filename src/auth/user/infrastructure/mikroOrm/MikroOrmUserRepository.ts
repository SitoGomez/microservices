import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { IUserRepository } from '../../domain/UserRepository';
import { User } from '../../domain/User';
import { UserEntity } from '../../../../shared/mikroOrm/entities/User.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmUserRepository implements IUserRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async register(user: User): Promise<void> {
    await this.userRepository.insert({
      user_id: user.getId(),
      fullname: user.getFullname(),
      email: user.getEmail(),
      password: user.getPassword(),
    });
  }
}
