import { Exchange, exchangeRates, getOAuthCallback, getOAuthParams, wallet } from 'lib/coinbase';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const getExchange = async (currency: string) => {
  try {
    const response = await exchangeRates({ currency });
    return response.data as Exchange;
  } catch (error) {
    return null;
  }
};

const Coinbase: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(5);

  const currency = 'BTC';
  const amount = '0.000001';
  const to = 'bc1qajayek9rf64qklj2rvjs2qpvdj0u5q3mkzyta2';

  const onClick = async () => {
    setLoading(true);

    const provider = 'coinbase';
    const url = '/coinbase';
    const account = 'all';
    const limitCurrency = 'USD';
    const limitPeriod = 'day';

    const exchange = await getExchange(limitCurrency);

    if (exchange) {
      const rate = exchange.rates[currency];

      // limit = base currency / exchange rate * fee fluctuation reserve * amount
      const limitAmount = Math.ceil((1 / rate) * 1.2 * +amount).toString();

      const limit = {
        currency: limitCurrency,
        amount: limitAmount,
        period: limitPeriod,
      };

      const scope = [wallet.accountsRead, wallet.transactionsSend, wallet.addressesRead];

      const callback = getOAuthCallback(url, { amount, currency, to });
      const params = getOAuthParams({ scope, account, limit });

      signIn(provider, { callbackUrl: callback }, params);
    } else {
      setError(true);
    }
  };

  if (error) {
    timer != 0 ? setTimeout(() => setTimer(timer - 1), 1000) : router.back();

    return (
      <text className="text-linebreak text-center container d-flex d-flex justify-content-center">
        {`Could not connect to Coinbase
          Redirect to Home in ${timer} seconds`}
      </text>
    );
  }

  if (loading) {
    return (
      <div className="container d-flex d-flex justify-content-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column">
      <button className="m-2 btn btn-primary" onClick={onClick}>
        Pay With Coinbase
      </button>
    </div>
  );
};

export default Coinbase;
