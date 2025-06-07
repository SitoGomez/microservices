import { IDateTimeService } from '../domain/IDateTimeService';

export class SystemDateTimeService implements IDateTimeService {
  public now(): number {
    return Date.now();
  }
}
