import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
  public constructor(
    userId: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @PrimaryKey({ fieldName: 'user_id', type: 'uuid' })
  public userId: string;

  @Property({
    fieldName: 'email',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public email: string;

  @Property({ fieldName: 'password', type: 'varchar', nullable: false })
  public password: string;

  @Property({ fieldName: 'created_at', type: 'timestampz' })
  public createdAt: Date;

  @Property({
    fieldName: 'modified_at',
    type: 'timestampz',
  })
  public updatedAt: Date;
}
