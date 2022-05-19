import axios from "axios";
import braintreeWeb from "braintree-web";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { BraintreeContext } from "../context/braintree";

const fields = {
  number: {
    selector: '#cardNumber',
    placeholder: '4111 1111 1111 1111'
  },
  cvv: {
    selector: '#cvv',
    placeholder: '123'
  },
  expirationDate: {
    selector: '#expirationDate',
    placeholder: '09/23'
  },
  postalCode: {
    selector: '#postalCode',
    placeholder: '11111'
  }
}

const styles = {
  'input': {
    'font-size': '16px',
    'font-family': 'courier, monospace',
    'font-weight': 'lighter',
    'color': '#CCCCCC'
  },
  ':focus': {
    'color': '#000000'
  },
  '.valid': {
    'color': '#8BDDA8'
  },
  '.invalid': {
    'color': '#FF0000'
  }
}

// @refresh reset
export default function Card() {
  // hook context
  const { clientToken, amount, currency } = useContext(BraintreeContext);

  // hook reference
  const button = useRef<HTMLButtonElement>(null);
  const submit = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

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
      const payment = await braintreeWeb.hostedFields.create({
        client: client,
        styles: styles,
        fields: fields
      });

      // payment event
      const paymentEvent = async (event: Event) => {
        try {
          // disable submit button 
          submit.current!.disabled = true;

          // prevent default post event
          event.preventDefault();

          // wait for payment submit
          const { nonce } = await payment.tokenize();

          // post payment token to server
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

      // add button payment listener
      form.current!.addEventListener('submit', paymentEvent, false);
    })();
  });

  // display payment container
  const event = () => card.current!.style.display = "block";

  return (
    <>
      <button className="btn btn-primary" ref={button} onClick={event}>Credit Card</button >

      <div className="container" ref={card} >
        <form ref={form} action="/" method="post">
          <label htmlFor="cardNumber">Card Number</label>
          <div className="input-group-text" id="cardNumber" ></div>

          <label htmlFor="expirationDate">Expiration Date</label>
          <div className="input-group-text" id="expirationDate" ></div>

          <label htmlFor="cvv">CVV</label>
          <div className="input-group-text" id="cvv" ></div>

          <label htmlFor="postalCode">Postal Code</label>
          <div className="input-group-text" id="postalCode" ></div>

          <div className="butonContainer">
            <input ref={submit} className="btn btn-primary" type="submit" value="Purchase" id="submit" />
          </div>
        </form>
      </div>

    </>
  )
}