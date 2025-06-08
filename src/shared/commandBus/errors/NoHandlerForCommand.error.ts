export class NoHandlerForCommandError extends Error {
  public constructor(commandName: string) {
    super(`No handler mapped for command: ${commandName}`);
    this.name = 'NoHandlerMappedError';
  }
}
