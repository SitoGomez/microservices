import * as dotenv from 'dotenv';

import { createMikroOrmCommandsDDBBBaseConfig } from './MikroOrmCommandsDDBB.base.config';

dotenv.config({ path: `.env.development` });

export default createMikroOrmCommandsDDBBBaseConfig();
