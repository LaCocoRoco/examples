import "reflect-metadata";
import { AuthChecker, buildSchema } from "type-graphql";
import { RecipeResolver } from "./resolver";
import { decodeAuthorizationToken } from "../jwt";

const authChecker: AuthChecker<Context> = ({ context }) => {
  const decoded = decodeAuthorizationToken(context.req.headers.authorization!);
  // invalid token will interrupt verification process
  context.user = decoded.user;
  return true;
};

export const schema = async () => {
  return await buildSchema({
    resolvers: [RecipeResolver],
    authChecker: authChecker,
  });
};