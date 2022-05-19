import config from "config";
import dynamic from "next/dynamic";
import { getGateway } from "../lib/braintree";
import { BraintreeContext } from "../context/braintree";

// dynamic import to reduce fist load size
const Card = dynamic(() => import('../components/card'));
const Google = dynamic(() => import('../components/google'));
const PayPal = dynamic(() => import('../components/paypal'));

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

export default function Home({
  clientToken,
  googleMerchantId,
}: Properties) {
  // payment data
  const amount = '10';
  const currency = 'EUR'

  return (
    <BraintreeContext.Provider value={{ googleMerchantId, clientToken, amount, currency }}>
      <div className="payment">
        <Card />
        <PayPal />
        <Google />
      </div>
    </BraintreeContext.Provider>
  );
}