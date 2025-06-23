import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users_activity' })
export class UserActivity {
  public constructor(
    userId: string,
    email: string,
    registrationDate: Date,
    lastLoginDate: Date | undefined,
    loginCount: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.userId = userId;
    this.email = email;
    this.registrationDate = registrationDate;
    this.lastLoginDate = lastLoginDate;
    this.loginCount = loginCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @PrimaryKey({ fieldName: 'user_id', type: 'uuid' })
  public userId: string;

  @Property()
  public email: string;

  @Property({ fieldName: 'registration_date', type: 'timestampz' })
  public registrationDate: Date;

  @Property({
    fieldName: 'last_login_date',
    type: 'timestampz',
    nullable: true,
  })
  public lastLoginDate: Date | undefined;

  @Property({ fieldName: 'login_count', type: 'integer' })
  public loginCount: number;

  @Property({ fieldName: 'created_at', type: 'timestampz' })
  public createdAt: Date;

  @Property({
    fieldName: 'modified_at',
    type: 'timestampz',
  })
  public updatedAt: Date;
}
