import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { IdempotentKeyNotFound } from './IdempotentKeyNotFound.error';

@Injectable()
export class RequiredIdempotentKeyMiddleware implements NestMiddleware {
  public use(req: Request, _res: Response, next: NextFunction): void {
    if (!req.headers['x-request-id']) {
      throw new IdempotentKeyNotFound();
    }

    next();
  }
}
