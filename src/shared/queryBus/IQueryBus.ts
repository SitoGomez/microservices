import { BaseQuery } from './BaseQuery';
import { IQueryHandler } from './IQueryHandler';

export interface IQueryBus {
  register<TQuery extends BaseQuery, TResult = void>(
    queryType: new (...args: any[]) => TQuery,
    handler: IQueryHandler<TQuery, TResult>,
  ): void;

  execute<TQuery extends BaseQuery, TResult = void>(
    query: TQuery,
  ): Promise<TResult>;
}

export const QUERY_BUS = Symbol('QueryBus');
