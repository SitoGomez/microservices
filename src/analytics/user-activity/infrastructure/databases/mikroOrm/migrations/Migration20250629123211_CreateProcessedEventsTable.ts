import { Migration } from '@mikro-orm/migrations';

export class Migration20250629123211_CreateProcessedEventsTable extends Migration {
  public override up(): void {
    this.addSql(`CREATE TABLE processed_events (
      event_id UUID PRIMARY KEY,
      event_type TEXT NOT NULL,
      processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );`);
  }

  public override down(): void {
    this.addSql(`DROP TABLE IF EXISTS processed_events;`);
  }
}
