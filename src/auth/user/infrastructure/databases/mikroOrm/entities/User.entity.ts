import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
  public constructor(
    user_id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  @PrimaryKey()
  user_id: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property({ fieldName: 'created_at', type: 'timestampz' })
  createdAt: Date;

  @Property({
    fieldName: 'modified_at',
    type: 'timestampz',
  })
  updatedAt: Date;
}
