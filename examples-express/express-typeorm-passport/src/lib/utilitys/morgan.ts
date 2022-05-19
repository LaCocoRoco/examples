// external modules
import morgan, { StreamOptions } from 'morgan';

// internal modules
import { logger } from './logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message.replace(/\n$/, '')),
};

export const loggerHttp = morgan('dev', { stream: stream });
