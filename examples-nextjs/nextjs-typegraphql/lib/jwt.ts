import jwt from "jsonwebtoken";
import config from "config";

const secret = config.get('jwt.secret') as string;

export const generateAuthorizationToken = (name: string) => {
  return jwt.sign({ user: { name: name } }, secret, { expiresIn: "1h" });
}

export const decodeAuthorizationToken = (token: string) => {
  return jwt.verify(token!, secret) as JwtPayload;
}