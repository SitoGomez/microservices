import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { UserActivityEntity } from '../entities/UserActivity.entity';

export class MikroOrmUserFactory extends Factory<UserActivityEntity> {
  public model = UserActivityEntity;

  public definition(): Partial<UserActivityEntity> {
    return {
      userId: crypto.randomUUID(),
      email: `${faker.person.firstName().toLowerCase()}${Number(faker.string.numeric(5))}@${faker.internet.domainName()}`,
      registrationDate: faker.date.past(),
      lastLoginAt: faker.date.recent(),
      loginCount: faker.number.int({ min: 1, max: 1000 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  }
}
