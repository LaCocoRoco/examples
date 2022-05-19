import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export declare global {
  interface User {
    name: string
  }

  interface JwtPayload extends jwt.JwtPayload {
    user: User;
  }

  interface Context {
    req: NextApiRequest;
    res: NextApiResponse;
    user: User;
  }
}
