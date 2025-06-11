import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey()
  user_id: string;

  @Property()
  fullname: string;

  @Property()
  email: string;

  @Property()
  password: string;
}
