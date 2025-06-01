import { User } from './User';

export interface IUserRepository {
  register(user: User): void;
}

export const USER_REPOSITORY = Symbol('UserRepository');
