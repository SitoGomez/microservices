import { ProcessedCommandResponseType } from './ProcessedCommandResponse.type';

export interface IProcessedCommandService {
  save(
    commandId: string,
    commandName: string,
    commandResponse: string | undefined,
  ): Promise<void>;
  findByCommandIdAndName(
    commandId: string,
    commandName: string,
  ): Promise<ProcessedCommandResponseType | undefined>;
  deleteOlderThan(date: Date): Promise<void>;
}

export const PROCESSED_COMMAND_SERVICE = Symbol('ProcessedCommandService');
