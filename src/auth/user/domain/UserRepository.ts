import { User } from './User';

export interface IUserRepository {
  register(user: User): Promise<void>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
