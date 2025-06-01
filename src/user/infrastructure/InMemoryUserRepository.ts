import { Injectable } from '@nestjs/common';
import { User } from '../domain/User';
import { IUserRepository } from '../domain/UserRepository';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  public register(user: User): void {
    this.users.push(user);
  }

  public stored(): User[] {
    return this.users;
  }

  public clean(): void {
    this.users = [];
  }
}
