import { User } from './User';

export interface IUserRepository {
  register(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
