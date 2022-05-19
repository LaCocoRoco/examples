import axios from "axios";
import Script from "next/script";
import braintreeWeb from "braintree-web";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { BraintreeContext } from "../context/braintree";

export default function Google() {
  // hook context
  const { googleMerchantId, clientToken, amount, currency } = useContext(BraintreeContext);

  // hook reference
  const submit = useRef<HTMLButtonElement>(null);

  // hook router
  const router = useRouter();

  // hook effect
  useEffect(() => {
    (async () => {
      // initialize braintree client
      const client = await braintreeWeb.client.create({
        authorization: clientToken
      });

      // initialize payment instance
      const payment = await braintreeWeb.googlePayment.create({
        client: client,
        googlePayVersion: 2,
      });

      // payment event
      const paymentEvent = async () => {
        try {
          // disable submit button 
          submit.current!.disabled = true;

          // create payment data
          const paymentDataRequest = await payment.createPaymentDataRequest({
            merchantInfo: {
              merchantId: googleMerchantId,
            },
            transactionInfo: {
              currencyCode: currency,
              totalPriceStatus: 'FINAL',
              totalPrice: amount,
            }
          });

          // initialize google client
          const googlePaymentsClient = new google.payments.api.PaymentsClient({
            environment: process.env.NODE_ENV === "development" ? "TEST" : "PRODUCTION",
          });

          // wait for payment submit
          const paymentData = await googlePaymentsClient.loadPaymentData(paymentDataRequest);

          // parse payment response
          const { nonce } = await payment.parseResponse(paymentData);

          // post payment token to server api
          const response = await axios.post('/api/checkout', {
            nonce: nonce,
            amount: amount,
          });

          // alert server response
          alert(response.data);

          // reload to generate new token
          router.reload();
        }

        catch (error) {
          if (error instanceof Error) {
            // enable submit button 
            submit.current!.disabled = false;

            // alert submit error
            alert(error.message);
          }
        }
      }

      // add event to google button
      submit.current!.addEventListener('click', paymentEvent, false);
    })();
  });

  return (
    <>
      <Script src="https://pay.google.com/gp/p/js/pay.js" />

      <button className="btn btn-primary" ref={submit} >Google</button >
    </>
  )
}