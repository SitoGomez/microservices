export class NoHandlerForQueryError extends Error {
  public constructor(queryName: string) {
    super(`No handler mapped for query: ${queryName}`);
    this.name = 'NoHandlerMappedError';
  }
}
