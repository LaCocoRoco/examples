import express from 'express';
import config from 'config';
import path from 'path';
import facebook from './lib/passport/facebook';
import github from './lib/passport/github';
import google from './lib/passport/google';
import { logger } from './lib/utilitys/logger';
import { loggerHttp } from './lib/utilitys/morgan';
import { router } from './routes/router';

const port = config.get('server.port');
const app = express();

const environmentDefault = async () => {
  // default environment
  app.use(express.static('public'));
  app.use(loggerHttp);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(facebook.initialize());
  app.use(github.initialize());
  app.use(google.initialize());
  app.use(router);
  app.listen(port);
};

const environmentProduction = async () => {
  // load react build folder
  app.use(express.static(path.join(__dirname, '..', 'react/build')));

  // load default environment
  environmentDefault();
};

const environmentDevelopment = async () => {
  // load default environment
  environmentDefault();
};

if (process.env.NODE_ENV === 'production') {
  logger.info('load environment production');
  environmentProduction();
}

if (process.env.NODE_ENV === 'development') {
  logger.info('load environment development');
  environmentDevelopment();
}

// TODO : eventuell passport einzelnd laden