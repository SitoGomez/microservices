export interface IDateTimeService {
  now(): number;
}

export const DATE_TIME_SERVICE = Symbol('IDateTimeService');
