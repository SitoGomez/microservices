import { Migration } from '@mikro-orm/migrations';

export class Migration20250721071112_AddProcessedAtToOutboxTables extends Migration {
  public override up(): void {
    this.addSql(`
      ALTER TABLE outbox_events ADD COLUMN processed_at TIMESTAMPTZ NULL;`);
  }

  public override down(): void {
    this.addSql(
      `ALTER TABLE outbox_events DROP COLUMN IF EXISTS processed_at;`,
    );
  }
}
