import axios from 'axios';
import { create } from 'braintree-web-drop-in';
import { useEffect, useRef } from 'react';

// define properties
interface Properties {
  clientToken: string;
  googleMerchantId: string;
  amount: string;
  currency: string;
}

// @refresh reset
export default function Braintree(props: Properties) {
  // hook reference
  const button = useRef<HTMLButtonElement>(null);

  // hook effect
  useEffect(() => {
    (async () => {
      const dropinInstance = await create({
        authorization: props.clientToken,
        container: '#container',
        vaultManager: true,
        applePay: {
          displayName: 'Merchant Name',
          paymentRequest: {
            total: {
              label: 'Localized Name',
              amount: props.amount,
            },
            countryCode: 'AT',
            currencyCode: props.currency,
            supportedNetworks: ['amex', 'discover', 'interac', 'masterCard', 'privateLabel', 'visa'],
            merchantCapabilities: [],
          },
        },
        googlePay: {
          merchantId: props.googleMerchantId,
          transactionInfo: {
            currencyCode: props.currency,
            totalPrice: props.amount,
            totalPriceStatus: 'FINAL',
          },
        },
        paypal: {
          flow: 'checkout',
          amount: props.amount,
          currency: props.currency,
        },
        paypalCredit: {
          flow: 'checkout',
          amount: props.amount,
          currency: props.currency
        },
        venmo: true
      });

      // braintree payment event
      const paymentEvent = async () => {
        try {
          // get payment nonce
          const { nonce } = await dropinInstance.requestPaymentMethod({
            threeDSecure: {
              amount: props.amount,
            }
          });

          // post payment to server api
          const response = await axios.post('/api/checkout', {
            nonce: nonce,
            amount: props.amount,
          });

          // alert server response
          alert(response.data);
        }

        catch (error) {
          if (error instanceof Error) {
            // alert submit error
            alert(error.message);
          }
        }
      }

      // add payment event
      button.current!.addEventListener('click', paymentEvent);
    })();
  });

  return (
    <div className="container" >
      <div id="container"></div>
      <button className="btn btn-primary" ref={button} >Purchase</button>
    </div>
  )
}