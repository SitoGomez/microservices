import { Migration } from '@mikro-orm/migrations';

export class Migration20250702151011_AddCommandResponseColumnToCommandProcessedTable extends Migration {
  public override up(): void {
    this.addSql(`
      ALTER TABLE processed_commands ADD COLUMN IF NOT EXISTS command_response JSONB;`);
  }

  public override down(): void {
    this.addSql(`
      ALTER TABLE processed_commands DROP COLUMN IF EXISTS command_response;`);
  }
}
