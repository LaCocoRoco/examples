// external modules
import { createLogger, format, addColors, transports } from 'winston';
import config from 'config';

export const logger = createLogger();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

const level: string = config.get('logger.level');

const defaultFormat = format.combine(
  format.splat(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const consoleFormat = format.combine(defaultFormat, format.colorize({ all: true }));

const transportsConsoleOptions = {
  level: level,
  levels: levels,
  format: consoleFormat,
};

const fileFormat = format.combine(defaultFormat);

const transportsFileOptions = {
  level: level,
  levels: levels,
  format: fileFormat,
  handleExceptions: true,
  filename: 'log/error.log',
  maxsize: 5242880,
  maxFiles: 5,
};

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console(transportsConsoleOptions));
}

if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File(transportsFileOptions));
}

addColors(colors);
