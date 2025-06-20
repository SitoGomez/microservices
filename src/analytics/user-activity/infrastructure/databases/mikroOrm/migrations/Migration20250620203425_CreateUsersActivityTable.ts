import { Migration } from '@mikro-orm/migrations';

export class Migration20250620203425_CreateUsersActivityTable extends Migration {
  public override up(): void {
    this.addSql(`CREATE TABLE users_activity (
        user_id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        registration_date TIMESTAMPTZ,
        last_login_at TIMESTAMPTZ,
        login_count INT DEFAULT 0);`);
  }

  public override down(): void {
    this.addSql(`DROP TABLE IF EXISTS users_activity;`);
  }
}
