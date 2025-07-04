import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import * as colorette from 'colorette';
import {
  Logger,
  LoggerOptions,
  createLogger,
  format,
  transports,
} from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';

import { ILogger } from './ILogger';

const { combine, timestamp, printf, colorize } = format;

@Injectable()
export class WinstonLogger implements ILogger {
  private readonly LOG_FOLDER: string = path.join(process.cwd(), 'logs');
  private winstonLogger: Logger;

  public constructor(
    serviceName: string,
    chosenServiceNameColor: colorette.Color,
  ) {
    this.createLogsFolderIfNotExists();

    this.winstonLogger = createLogger({
      level: 'info',
      transports: [
        new transports.Console({
          format: combine(
            format((info) => {
              info.nonColorizedLevel = info.level;
              return info;
            })(),
            colorize({ level: true }),
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            printf((info) => {
              return `[ ${chosenServiceNameColor(serviceName)} ]- ${String(info.timestamp)} -[${String(info.level)}]: ${this.getMessageLogColor(info.nonColorizedLevel as string)(String(info.message))}`;
            }),
          ),
        }),
        this.logToFileWithRotation(serviceName, 'info', 'info'),
        this.logToFileWithRotation(serviceName, 'error', 'error'),
      ],
    });
  }

  private createLogsFolderIfNotExists(): void {
    if (!fs.existsSync(this.LOG_FOLDER)) {
      fs.mkdirSync(this.LOG_FOLDER);
    }
  }

  private logToFileWithRotation(
    serviceName: string,
    level: LoggerOptions['level'],
    filename: string,
  ): DailyRotateFile {
    return new transports.DailyRotateFile({
      level,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf((info) => {
          return `[ ${serviceName} ]- ${String(info.timestamp)} -[${String(info.level)}]: ${String(info.message)}`;
        }),
      ),
      filename: `${path.join(this.LOG_FOLDER, filename)}_%DATE%`,
      maxSize: '20mb',
      maxFiles: '3',
      extension: '.log',
      datePattern: 'YYYY-ww',
    });
  }

  private getMessageLogColor(level: string): colorette.Color {
    switch (level) {
      case 'info':
        return colorette.cyan;
      case 'error':
        return colorette.red;
      default:
        return colorette.white;
    }
  }

  public info(message: string, ...args: unknown[]): void {
    this.winstonLogger.info(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.winstonLogger.error(message, ...args);
  }
}
