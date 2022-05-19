import { NextApiRequest, NextApiResponse } from "next"
import Cors from "cors";

export const cors = async (options: Cors.CorsOptions, req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    Cors(options)(req, res, (next: any) => {
      return next instanceof Error ? reject(next) : resolve(next)
    })
  })
}
