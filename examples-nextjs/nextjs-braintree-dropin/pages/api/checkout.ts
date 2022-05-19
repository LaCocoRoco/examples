import { NextApiRequest, NextApiResponse } from "next";
import { getGateway } from "../../lib/braintree";

// get braintree gateway
const gateway = getGateway();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // finalize transaction
  const response = await gateway.transaction.sale({
    amount: req.body.amount,
    paymentMethodNonce: req.body.nonce,
  });

  // transaction response
  if (response.errors) {
    res.status(200).json(response.message);
  } else {
    res.status(200).json(response.transaction.processorResponseText);
  }
}