import { Injectable } from '@nestjs/common';

import { User } from '../../domain/User';
import { IUserRepository } from '../../domain/UserRepository';

@Injectable()
export class UserRepositoryMock implements IUserRepository {
  private users: User[] = [];

  public register(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  public stored(): User[] {
    return this.users;
  }

  public clean(): void {
    this.users = [];
  }
}
