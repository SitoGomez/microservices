import { Migration } from '@mikro-orm/migrations';

export class Migration20250721071213_RemovePublishedAtFromToOutboxTables extends Migration {
  public override up(): void {
    this.addSql(`
      ALTER TABLE outbox_events DROP COLUMN IF EXISTS published_at;`);
  }

  public override down(): void {
    this.addSql(
      `ALTER TABLE outbox_events ADD COLUMN published_at TIMESTAMPTZ NULL;`,
    );
  }
}
