import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'processed_commands' })
export class ProcessedCommandEntity {
  public constructor(
    commandId: string,
    commandName: string,
    commandResponse?: string,
    processedAt?: Date,
  ) {
    this.commandId = commandId;
    this.commandName = commandName;
    this.commandResponse = commandResponse;
    this.processedAt = processedAt;
  }

  @PrimaryKey({ fieldName: 'command_id', type: 'uuid' })
  public commandId: string;

  @Property({ fieldName: 'command_name', type: 'text' })
  public commandName: string;

  @Property({ fieldName: 'command_response', type: 'jsonb' })
  public commandResponse?: string;

  @Property({
    fieldName: 'processed_at',
    type: 'timestampz',
  })
  public processedAt: Date | undefined;
}
