export class IdempotentKeyNotFound extends Error {
  public constructor() {
    super(
      `Idempotent key not found, please provide it in the request headers.`,
    );
  }
}
