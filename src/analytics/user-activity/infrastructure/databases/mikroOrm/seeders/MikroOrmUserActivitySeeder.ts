import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { MikroOrmUserFactory } from '../factories/MikroOrmUserActivity.factory';

export class MikroOrmUserActivitySeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    const usersActivity = new MikroOrmUserFactory(em).make(100_000);

    await em.persistAndFlush(usersActivity);
  }
}
