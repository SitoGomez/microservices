import { Migration } from '@mikro-orm/migrations';

export class Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable extends Migration {
  public override up(): void {
    this.addSql(
      `ALTER TABLE users_activity
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
    );
  }

  public override down(): void {
    this.addSql(`ALTER TABLE users_activity
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS modified_at;`);
  }
}
