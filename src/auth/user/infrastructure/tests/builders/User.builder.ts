import { User } from '../../../domain/User';

export class UserBuilder {
  private email: string = 'test@test.com';
  private password: string =
    '$2b$12$pAGxHo.h70dJblX2kEb1JOvci8Vxi4DTbT3lw3ETUioPNXYCjVPBe';
  private userId: string = '238778b5-e633-4071-8dac-4012cb46ee3e';
  private createdAt: Date = new Date('2023-10-01T00:00:00.000Z');
  private updatedAt: Date = new Date('2024-06-06T00:00:00.000Z');

  private constructor() {}

  public static anUser(): UserBuilder {
    return new UserBuilder();
  }

  public withUserId(userId: string): UserBuilder {
    this.userId = userId;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  public withCreatedAt(createdAt: Date): UserBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public withUpdatedAt(updatedAt: Date): UserBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  public build(): User {
    return User.fromPrimitives(
      this.userId,
      this.email,
      this.password,
      this.createdAt,
      this.updatedAt,
    );
  }
}
