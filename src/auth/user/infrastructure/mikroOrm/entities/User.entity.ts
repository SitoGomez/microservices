import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
  public constructor(user_id: string, email: string, password: string) {
    this.user_id = user_id;
    this.email = email;
    this.password = password;
  }

  @PrimaryKey()
  user_id: string;

  @Property()
  email: string;

  @Property()
  password: string;
}
