export interface ILogger {
  info(message: string, ...args: any[]): void;
}

export const LOGGER = Symbol('Logger');
