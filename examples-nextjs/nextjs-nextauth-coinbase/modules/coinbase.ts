import axios from 'axios';
import { NextApiRequest } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import { listAccounts, listAddresses, sendMoney, SendMoneyParams, SendMoneyResponse, showAuthorization } from 'lib/coinbase';

export const confirmTransaction = async (req: NextApiRequest) => {
  try {
    const { id, to, amount, currency, verify } = req.query;
    const secret = process.env.NEXTAUTH_SECRET;
    const { accessToken: token } = (await getToken({ req, secret })) as JWT;
    const params = { token, to, amount, currency, id, verify } as SendMoneyParams;
    const { data: transaction } = await sendMoney(params);
    return transaction;
  } catch (error) {
    return null;
  }
};

export const sendTransaction = async (req: NextApiRequest) => {
  try {
    const { id, to, amount, currency } = req.query;
    const secret = process.env.NEXTAUTH_SECRET;
    const { accessToken: token } = (await getToken({ req, secret })) as JWT;
    const params = { token, to, amount, currency, id } as SendMoneyParams;
    await sendMoney(params);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { errors } = error.response.data as SendMoneyResponse;
        const status = errors.shift();

        if (status && status.id === 'two_factor_required') {
          return true;
        }
      }
    }
  }

  return null;
};

export const getAccounts = async (req: NextApiRequest) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const { accessToken: token } = (await getToken({ req, secret })) as JWT;
    const { data: accounts } = await listAccounts({ token });
    return accounts;
  } catch (error) {
    return null;
  }
};

export const getAddresses = async (req: NextApiRequest) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const { accessToken: token } = (await getToken({ req, secret })) as JWT;
    const { data: addresses } = await listAddresses({ token, id: req.query.id as string });
    return addresses;
  } catch (error) {
    return null;
  }
};

export const getAuthorization = async (req: NextApiRequest) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const { accessToken: token } = (await getToken({ req, secret })) as JWT;
    const { data: authorization } = await showAuthorization({ token });
    return authorization;
  } catch (error) {
    return null;
  }
};
