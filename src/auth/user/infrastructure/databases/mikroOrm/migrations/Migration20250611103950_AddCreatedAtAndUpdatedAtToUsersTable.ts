import { Migration } from '@mikro-orm/migrations';

export class Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable extends Migration {
  public override up(): void {
    this.addSql(
      `ALTER TABLE users
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
    );
  }

  public override down(): void {
    this.addSql(`ALTER TABLE users
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS modified_at;`);
  }
}
