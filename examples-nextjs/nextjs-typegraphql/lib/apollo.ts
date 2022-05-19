import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import { schema } from "./graphql/schema";

const apolloServerInitialized = (async () => {
  // build schema before initializing apollo server
  const apolloServer = new ApolloServer({
    schema: await schema(),
    context: (context: Context): Context => context
  });

  await apolloServer.start();

  return apolloServer;
})();

export const apolloServer = async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloServer = await apolloServerInitialized;

  const apolloHandler = apolloServer.createHandler({
    path: req.url,
  });

  await apolloHandler(req, res);
}