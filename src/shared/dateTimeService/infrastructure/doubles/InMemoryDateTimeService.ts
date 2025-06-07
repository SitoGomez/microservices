import { IDateTimeService } from '../../domain/IDateTimeService';

const DEFAULT_TIMESTAMP = 1749285081975;

export class InMemoryDateTimeService implements IDateTimeService {
  private timestampInMs: number = DEFAULT_TIMESTAMP;

  public setTimestamp(timestampInMs: number): void {
    this.timestampInMs = timestampInMs;
  }

  public now(): number {
    return this.timestampInMs;
  }

  public clean(): void {
    this.timestampInMs = DEFAULT_TIMESTAMP;
  }
}
