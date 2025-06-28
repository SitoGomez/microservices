import * as dotenv from 'dotenv';

import createMikroOrmQueriesDDBBBaseConfig from './MikroOrmQueriesDDBB.base.config';

dotenv.config({ path: `.env.development` });

export default createMikroOrmQueriesDDBBBaseConfig();
