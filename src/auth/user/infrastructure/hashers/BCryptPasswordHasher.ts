import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { IPasswordHasher } from '../../domain/IPasswordHasher';

@Injectable()
export class BCryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12;

  public constructor() {}

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
