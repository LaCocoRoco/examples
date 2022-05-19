import React from "react";

interface Context {
  clientToken: string
  googleMerchantId: string
  amount: string
  currency: string
}

const defaultContext = {
  clientToken: '',
  googleMerchantId: '',
  amount: '',
  currency: '',
};

export const BraintreeContext = React.createContext<Context>(defaultContext);