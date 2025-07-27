import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ILogger } from '../../../logger/ILogger';
import { BaseQuery } from '../../BaseQuery';
import { NoHandlerForQueryError } from '../../errors/NoHandlerForQuery.error';
import { IQueryBus } from '../../IQueryBus';
import { IQueryHandler } from '../../IQueryHandler';

@Injectable()
export class MikroOrmQueryBus implements IQueryBus {
  private readonly logger: ILogger;
  private readonly mikroOrm: MikroORM;

  public constructor(logger: ILogger, mikroOrm: MikroORM) {
    this.logger = logger;
    this.mikroOrm = mikroOrm;
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

    const existingEM = RequestContext.getEntityManager();

    if (existingEM) {
      return this.executeQuery<T, TResult>(queryName, queryId, handler, query);
    }

    const emFork = this.mikroOrm.em.fork({ useContext: true });

    return RequestContext.create(emFork, async () => {
      return this.executeQuery<T, TResult>(queryName, queryId, handler, query);
    });
  }

  private executeQuery<T extends BaseQuery, TResult = void>(
    queryName: string,
    queryId: string,
    handler: IQueryHandler<T, TResult>,
    query: T,
  ): Promise<TResult> {
    this.logger.info(`Executing query: ${queryName} with id: ${queryId}`);
    return handler.execute(query);
  }
}
