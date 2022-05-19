import axios from "axios";
import braintreeWeb from "braintree-web";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { BraintreeContext } from "../context/braintree";

export default function PayPal() {
  // hook context
  const { clientToken, amount, currency } = useContext(BraintreeContext);

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
      const payment = await braintreeWeb.paypal.create({
        client: client
      });

      // payment event
      const paymentEvent = async () => {
        try {
          // disable submit button 
          submit.current!.disabled = true;

          // wait for payment submit
          const { nonce } = await payment.tokenize({
            flow: 'vault',
            amount: amount,
            currency: currency
          });

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

      // add event to paypal button
      submit.current!.addEventListener('click', paymentEvent, false);
    })();
  });

  return (
    <button className="btn btn-primary" ref={submit}>PayPal</button>
  )
}