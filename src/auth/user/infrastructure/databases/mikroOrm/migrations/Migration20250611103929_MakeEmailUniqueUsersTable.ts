import { Migration } from '@mikro-orm/migrations';

export class Migration20250611103929_MakeEmailUniqueUsersTable extends Migration {
  public override up(): void {
    this.addSql(`
      ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);`);
  }

  public override down(): void {
    this.addSql(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_email;`);
  }
}
