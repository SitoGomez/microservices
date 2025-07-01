export interface IProcessedCommandService {
  save(commandId: string, commandName: string): Promise<void>;
  isProcessed(commandId: string, commandName: string): Promise<boolean>;
}

export const PROCESSED_COMMAND_SERVICE = Symbol('ProcessedCommandService');
