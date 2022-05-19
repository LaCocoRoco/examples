import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from 'next';
import { apolloServer } from "../../lib/apollo";
import { cors } from "../../lib/cors";

const options = {
  credentials: true,
  origin: 'https://studio.apollographql.com',
  exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST'],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(options, req, res);
  await apolloServer(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
}