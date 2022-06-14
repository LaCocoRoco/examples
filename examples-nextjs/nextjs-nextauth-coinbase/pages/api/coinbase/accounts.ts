import { getAccounts } from 'modules/coinbase';
import type { NextApiRequest, NextApiResponse } from 'next';

const accounts = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await getAccounts(req);
  res.status(200).json(result);
};

export default accounts;