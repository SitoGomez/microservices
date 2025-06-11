import { Migration } from '@mikro-orm/migrations';

export class Migration20250611103928_CreateUsersTable extends Migration {
  public override up(): void {
    this.addSql(
      `CREATE TABLE users (
        user_id UUID PRIMARY KEY,
        fullname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL);`,
    );
    this.addSql(`CREATE UNIQUE INDEX idx_users_email ON users(email);`);
  }

  public override down(): void {
    this.addSql(`DROP INDEX IF EXISTS idx_users_email;`);
    this.addSql(`DROP TABLE IF EXISTS users;`);
  }
}
