import { Migration } from '@mikro-orm/migrations';

export class Migration20250705071011_AddOutboxTables extends Migration {
  public override up(): void {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS outbox_events_event_status (
        id smallint PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
      );`);

    this.addSql(`
      INSERT INTO outbox_events_event_status (id, name)
      VALUES
        (1, 'PENDING'),
        (2, 'PROCESSED'),
        (3, 'FAILED')
        ON CONFLICT (id) DO NOTHING;`);

    this.addSql(`
      CREATE TABLE IF NOT EXISTS outbox_events (
        event_id UUID PRIMARY KEY,
        event_type TEXT NOT NULL,
        event_status smallint NOT NULL,
        event_version smallint NOT NULL,
        payload JSONB NOT NULL,
        retry_count INTEGER DEFAULT 0 NOT NULL,
        next_retry_at TIMESTAMPTZ NULL,
        occurred_at TIMESTAMPTZ NOT NULL,
        published_at TIMESTAMPTZ NULL);`);

    this.addSql(`
      ALTER TABLE outbox_events ADD CONSTRAINT fk_outbox_events_outbox_events_event_status_id FOREIGN KEY (event_status) REFERENCES outbox_events_event_status (id);`);
  }

  public override down(): void {
    this.addSql(
      `ALTER TABLE outbox_events DROP CONSTRAINT IF EXISTS fk_outbox_events_outbox_events_event_status_id;`,
    );
    this.addSql(`DROP TABLE IF EXISTS outbox_events_event_status;`);
    this.addSql(`DROP TABLE IF EXISTS outbox_events;`);
  }
}
