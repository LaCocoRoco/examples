import config from "config";
import { BraintreeGateway, Environment } from "braintree";

export const getGateway = () => {
  return new BraintreeGateway({
    merchantId: config.get('braintree.merchantId'),
    publicKey: config.get('braintree.publicKey'),
    privateKey: config.get('braintree.privateKey'),
    environment: process.env.NODE_ENV === "development" ?
      Environment.Sandbox : Environment.Production
  });
}