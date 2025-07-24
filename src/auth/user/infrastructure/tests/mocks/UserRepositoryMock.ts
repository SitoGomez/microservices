import { Injectable } from '@nestjs/common';

import { User } from '../../../domain/User';
import { IUserRepository } from '../../../domain/UserRepository';

@Injectable()
export class UserRepositoryMock implements IUserRepository {
  private toReturn: User[] | null = null;
  private storedUsers: User[] = [];

  public setUsers(users: User[]): void {
    this.toReturn = users;
  }

  public stored(): User[] {
    return this.storedUsers;
  }

  public clean(): void {
    this.storedUsers = [];
  }

  public register(user: User): Promise<void> {
    this.storedUsers.push(user);
    return Promise.resolve();
  }

  public findByEmail(_: string): Promise<User | null> {
    return this.toReturn && this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0]!)
      : Promise.resolve(null);
  }
}
