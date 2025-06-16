import { Migration } from '@mikro-orm/migrations';

export class Migration20250611103940_RemoveFullnameColumnFromUsersTable extends Migration {
  public override up(): void {
    this.addSql(`ALTER TABLE users DROP COLUMN IF EXISTS fullname;`);
  }

  public override down(): void {
    this.addSql(`ALTER TABLE users ADD COLUMN fullname;`);
  }
}
