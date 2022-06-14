import axios, { AxiosRequestConfig } from 'axios';
import { Authorization } from 'lib/coinbase';
import { NextPage } from 'next';
import { Account } from 'next-auth';
import { useEffect } from 'react';

const getAuthorization = async () => {
  try {
    const config: AxiosRequestConfig = {
      url: '/api/coinbase/authorization',
      method: 'GET',
    };

    const response = await axios(config);
    return response.data as Authorization;
  } catch (error) {
    return null;
  }
};

const getAccounts = async () => {
  try {
    const config: AxiosRequestConfig = {
      url: '/api/coinbase/accounts',
      method: 'GET',
    };

    const response = await axios(config);
    return response.data as Account[];
  } catch (error) {
    return null;
  }
};
const Coinbase: NextPage = () => {
  useEffect(() => {
    (async () => {
      const authorization = await getAuthorization();
      const accounts = await getAccounts();

      console.log('authorization: ', authorization);
      console.log('accounts: ', accounts);
    })();
  });

  return <div className="text-center d-flex flex-column">Open Console</div>;
};

export default Coinbase;
