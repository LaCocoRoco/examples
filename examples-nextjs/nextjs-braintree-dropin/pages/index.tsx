import Head from 'next/head';
import config from 'config';
import dynamic from 'next/dynamic';
import { getGateway } from '../lib/braintree';

// dynamic import to reduce fist load size
const Braintree = dynamic(() => import('../components/braintree'));

// get braintree gateway
const gateway = getGateway();

// define properties
interface Properties {
  clientToken: string;
  googleMerchantId: string;
}

export const getServerSideProps = async () => {
  // get braintree client token
  const { clientToken } = await gateway.clientToken.generate({});

  // get google merchant id
  const googleMerchantId = config.get('google.merchantId');

  return {
    props: {
      clientToken: clientToken,
      googleMerchantId: googleMerchantId,
    } as Properties
  }
}

// @refresh reset
export default function Home({
  clientToken,
  googleMerchantId
}: Properties) {
  // payment data
  const amount = '10.00';
  const currency = 'EUR';

  return (
    <>
      <Head>
        <title>NextJS Braintree Dropin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container" >
        <Braintree  {...{ clientToken, googleMerchantId, amount, currency }} />
      </div>
    </>
  )
}