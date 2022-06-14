import { getAuthorization } from 'modules/coinbase';
import type { NextApiRequest, NextApiResponse } from 'next';

const authorization = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await getAuthorization(req);
  res.status(200).json(result);
};

export default authorization;
