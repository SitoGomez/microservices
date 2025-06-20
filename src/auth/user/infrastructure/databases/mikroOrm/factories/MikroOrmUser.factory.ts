import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { UserEntity } from '../entities/User.entity';

export class MikroOrmUserFactory extends Factory<UserEntity> {
  public model = UserEntity;

  public definition(): Partial<UserEntity> {
    return {
      userId: crypto.randomUUID(),
      email: `${faker.person.firstName().toLowerCase()}${Number(faker.string.numeric(5))}@${faker.internet.domainName()}`,
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  }
}
