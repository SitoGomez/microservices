import { Migration } from '@mikro-orm/migrations';

export class Migration20250623165818_MakeLastLoginColumnNullableForUsersActivityTable extends Migration {
  public override up(): void {
    this.addSql(
      `ALTER TABLE users_activity ALTER COLUMN "last_login_at" SET NOT NULL;`,
    );
  }

  public override down(): void {
    this.addSql(
      `ALTER TABLE users_activity ALTER COLUMN "last_login_at" DROP NOT NULL;`,
    );
  }
}
