import { Injectable } from '@nestjs/common';
import { blue, cyan } from 'colorette';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, createLogger, format, transports } from 'winston';
import { ILogger } from './ILogger';
const { combine, timestamp, printf, colorize } = format;

@Injectable()
export class WinstonLogger implements ILogger {
  private readonly LOG_FOLDER: string = path.join(process.cwd(), 'logs');
  private winstonLogger: Logger;

  public constructor(serviceName: string) {
    this.createLogsFolderIfNotExists();

    this.winstonLogger = createLogger({
      level: 'info',
      transports: [
        new transports.Console({
          format: combine(
            colorize({ level: true }),
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            printf((info) => {
              return `[ ${blue(serviceName)} ]- ${String(info.timestamp)} -[${String(info.level)}]: ${cyan(String(info.message))}`;
            }),
          ),
        }),
        new transports.File({
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            printf((info) => {
              return `[ ${serviceName} ]- ${String(info.timestamp)} -[${String(info.level)}]: ${String(info.message)}`;
            }),
          ),
          filename: path.join(this.LOG_FOLDER, 'combined.log'),
        }),
        new transports.File({
          level: 'error',
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            printf((info) => {
              return `[ ${serviceName} ]- ${String(info.timestamp)} -[${String(info.level)}]: ${String(info.message)}`;
            }),
          ),
          filename: path.join(this.LOG_FOLDER, 'errors.log'),
        }),
      ],
    });
  }

  private createLogsFolderIfNotExists(): void {
    if (!fs.existsSync(this.LOG_FOLDER)) {
      fs.mkdirSync(this.LOG_FOLDER);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    this.winstonLogger.info(message, ...args);
  }
}
