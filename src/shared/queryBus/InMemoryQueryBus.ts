import { Injectable } from '@nestjs/common';

import { ILogger } from '../logger/ILogger';

import { BaseQuery } from './BaseQuery';
import { NoHandlerForQueryError } from './errors/NoHandlerForQuery.error';
import { IQueryBus } from './IQueryBus';
import { IQueryHandler } from './IQueryHandler';

@Injectable()
export class InMemoryQueryBus implements IQueryBus {
  private readonly logger: ILogger;

  public constructor(logger: ILogger) {
    this.logger = logger;
  }

  private handlers = new Map<string, IQueryHandler<BaseQuery, any>>();

  public register<T extends BaseQuery, TResult = void>(
    queryType: new (...args: any[]) => T,
    handler: IQueryHandler<T, TResult>,
  ): void {
    const queryName = queryType.name;
    this.handlers.set(queryName, handler as IQueryHandler<BaseQuery, any>);
  }

  public async execute<T extends BaseQuery, TResult = void>(
    query: T,
  ): Promise<TResult> {
    const queryName = query.constructor.name;
    const queryId = query.id;

    const handler = this.handlers.get(queryName) as
      | IQueryHandler<T, TResult>
      | undefined;

    if (!handler) {
      throw new NoHandlerForQueryError(queryName);
    }

    this.logger.info(`Executing query: ${queryName} with id: ${queryId}`);
    return handler.execute(query);
  }
}
