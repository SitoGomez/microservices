import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { MikroOrmUserFactory } from '../factories/MikroOrmUser.factory';

export class MikroOrmUserSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    const users = new MikroOrmUserFactory(em).make(100_000);

    await em.persistAndFlush(users);
  }
}
