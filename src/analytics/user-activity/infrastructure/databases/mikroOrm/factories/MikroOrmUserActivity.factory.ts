import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { UserActivity } from '../entities/UserActivity.entity';

export class MikroOrmUserFactory extends Factory<UserActivity> {
  public model = UserActivity;

  public definition(): Partial<UserActivity> {
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
