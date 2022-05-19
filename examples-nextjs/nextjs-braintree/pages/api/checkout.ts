import config from "config";
import braintree from "braintree";
import { getGateway } from "../../lib/braintree";
import { NextApiRequest, NextApiResponse } from "next";

// get braintree gateway
const gateway = getGateway();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get braintree client token
  const { clientToken } = await gateway.clientToken.generate({});

  // finalize transaction
  const response = await gateway.transaction.sale({
    amount: req.body.amount,
    paymentMethodNonce: req.body.nonce,
    options: {
      submitForSettlement: true
    }
  });

  // transaction response
  if (response.errors) {
    res.status(200).json(response.message);
  } else {
    res.status(200).json(response.transaction.processorResponseText);
  }
}