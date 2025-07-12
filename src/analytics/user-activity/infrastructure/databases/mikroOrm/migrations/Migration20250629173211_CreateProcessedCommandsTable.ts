import { Migration } from '@mikro-orm/migrations';

export class Migration20250629123211_CreateProcessedCommandsTable extends Migration {
  public override up(): void {
    this.addSql(`CREATE TABLE processed_commands (
      command_id UUID PRIMARY KEY,
      command_name TEXT NOT NULL,
      processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );`);
  }

  public override down(): void {
    this.addSql(`DROP TABLE IF EXISTS processed_commands;`);
  }
}
