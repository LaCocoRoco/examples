import { https } from 'firebase-functions';
import nextConfig from '../next.config';
import next from 'next';

const nextServer = next({
  dev: false,
  conf: nextConfig,
});

const handler = nextServer.getRequestHandler();

export const server = https.onRequest(async (req, res) => {
  await nextServer.prepare();
  return handler(req, res);
});
