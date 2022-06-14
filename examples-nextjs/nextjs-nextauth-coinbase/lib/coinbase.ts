import axios, { AxiosRequestConfig } from 'axios';

export interface Failure {
  errors: Error[]
}

export interface Error {
  id: string
  message: string
  url: string
}

export interface Pagination {
  ending_before: any
  starting_after: any
  limit: number
  order: string
  previous_uri: any
  next_uri: any
}

export const wallet = {
  accountsRead: 'wallet:accounts:read',
  accountsUpdate: 'wallet:accounts:update',
  accountsCreate: 'wallet:accounts:create',
  accountsDelete: 'wallet:accounts:delete',
  addressesRead: 'wallet:addresses:read',
  addressesCreate: 'wallet:addresses:create',
  buysRead: 'wallet:buys:read',
  buysCreate: 'wallet:buys:create',
  despoistsRead: 'wallet:deposits:read',
  depositsCreate: 'wallet:deposits:create',
  notificationsRead: 'wallet:notifications:read',
  paymentRead: 'wallet:payment-methods:read',
  paymentDelete: 'wallet:payment-methods:delete',
  paymentLimits: 'wallet:payment-methods:limits',
  sellsRead: 'wallet:sells:read',
  sellsCreate: 'wallet:sells:create',
  transactionsRead: 'wallet:transactions:read',
  transactionsSend: 'wallet:transactions:send',
  transactionsRequest: 'wallet:transactions:request',
  transactionsTransfer: 'wallet:transactions:transfer',
  userRead: 'wallet:user:read',
  userUpdate: 'wallet:user:update',
  userEmail: 'wallet:user:email',
  withdrawalsRead: 'wallet:withdrawals:read',
  withdrawalsCreate: 'wallet:withdrawals:create',
};

export const version = {
  'CB-VERSION': '2022-04-17'
};

export const getOAuthCallback = (callback: string, options: { [key: string]: string }) => {
  return `${callback}?${new URLSearchParams({
    ...(options && { ...options })
  }).toString()}`;
};

export interface Limit {
  currency?: string
  amount?: string
  period?: string
}

export interface OAuthParams {
  scope?: string[];
  name?: string;
  account?: string;
  limit?: Limit
}

export const getOAuthParams = (params: OAuthParams) => {
  const { scope, name, account, limit } = params;

  return new URLSearchParams({
    ...(scope && { 'scope': scope.join(',') }),
    ...(account && { 'account': account }),
    ...(name && { 'meta[name]': name }),
    ...(limit && limit.amount && { 'meta[send_limit_amount]': limit.amount }),
    ...(limit && limit.currency && { 'meta[send_limit_currency]': limit.currency }),
    ...(limit && limit.period && { 'meta[send_limit_period]': limit.period })
  }).toString();
};

export interface Rates {
  [key: string]: number
}

export interface Exchange {
  currency: string
  rates: Rates
}

export interface ExchangeRatesResponse {
  data: Exchange
}

export interface ExchangeRatesParams {
  currency: string
}

export const exchangeRates = async (params?: ExchangeRatesParams) => {
  const config: AxiosRequestConfig = {
    url: 'https://api.coinbase.com/v2/exchange-rates',
    method: 'GET',
    params: {
      currency: params && params.currency
    },
    headers: {
      ...version
    }
  };

  const response = await axios(config);
  return response.data as ExchangeRatesResponse;
};

export interface Prices {
  amount: string
  currency: string
}

export interface PricesResponse {
  data: Prices
}

export interface PricesParams {
  from?: string
  to?: string
}

export const prices = async (params: PricesParams) => {
  const config: AxiosRequestConfig = {
    url: `https://api.coinbase.com/v2/prices/${params.from}-${params.to}/buy`,
    method: 'GET',
    headers: {
      ...version
    }
  };

  const response = await axios(config);
  return response.data as PricesResponse;
};

export interface Authorization {
  method: string
  scopes: string[]
  oauth_meta: OauthMeta
}

export interface OauthMeta {
  send_limit_amount: string
  send_limit_currency: string
  send_limit_period: string
  name: string
}

export interface ShowAuthorizationResponse {
  data: Authorization
  errors: Error[]
}

export interface ShowAuthorizationParams {
  token?: string
}

export const showAuthorization = async (params: ShowAuthorizationParams) => {
  const config: AxiosRequestConfig = {
    url: 'https://api.coinbase.com/v2/user/auth',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${params.token}`,
      ...version
    }
  };

  const response = await axios(config);
  return response.data as ShowAuthorizationResponse;
};

export interface Account {
  id: string
  name: string
  primary: boolean
  type: string
  currency: string
  balance: Balance
  created_at: string
  updated_at: string
  resource: string
  resource_path: string
  ready?: boolean
}

export interface Balance {
  amount: string
  currency: string
}

export interface ListAccountsParams {
  token?: string
}

export interface ListAccountsResponse {
  pagination: Pagination
  data: Account[]
  errors: Error[]
}

export const listAccounts = async (params: ListAccountsParams) => {
  const config: AxiosRequestConfig = {
    url: 'https://api.coinbase.com/v2/accounts',
    method: 'GET',
    params: {
      limit: '200'
    },
    headers: {
      'Authorization': `Bearer ${params.token}`,
      ...version
    }
  };

  const response = await axios(config);
  return response.data as ListAccountsResponse;
};

export interface Address {
  id: string
  address: string
  name: any
  created_at: string
  updated_at: string
  network: string
  resource: string
  resource_path: string
}

export interface ListAddressesParams {
  token?: string
  id?: string
}

export interface ListAddressesResponse {
  pagination: Pagination
  data: Address[]
  errors: Error[]
}

export const listAddresses = async (params: ListAddressesParams) => {
  const config: AxiosRequestConfig = {
    url: `https://api.coinbase.com/v2/accounts/${params.id}/addresses`,
    method: 'GET',
    params: {
      limit: '200'
    },
    headers: {
      'Authorization': `Bearer ${params.token}`,
      ...version
    }
  };

  const response = await axios(config);
  return response.data as ListAddressesResponse;
};

export interface Transaction {
  id: string
  type: string
  status: string
  amount: Amount
  native_amount: NativeAmount
  description: any
  created_at: string
  updated_at: string
  resource: string
  resource_path: string
  network: Network
  to: To
  details: Details
}

export interface Amount {
  amount: string
  currency: string
}

export interface NativeAmount {
  amount: string
  currency: string
}

export interface Network {
  status: string
  hash: string
  name: string
}

export interface To {
  resource: string
  address: string
}

export interface Details {
  title: string
  subtitle: string
}

export interface SendMoneyParams {
  token?: string
  verify?: string
  id?: string
  to?: string
  amount?: string
  currency?: string
  description?: string
  skipNotifications?: boolean
  fee?: string
  idem?: string
  toFinancialInstitution?: boolean
  financialInstitutionWebsite?: string
}

export interface SendMoneyResponse {
  data: Transaction
  errors: Error[]
}

export const sendMoney = async (params: SendMoneyParams) => {
  const { token, verify, id, to, amount, currency, description, skipNotifications,
    fee, idem, toFinancialInstitution, financialInstitutionWebsite } = params;

  const config: AxiosRequestConfig = {
    url: `https://api.coinbase.com/v2/accounts/${id}/transactions`,
    method: 'POST',
    data: {
      type: 'send',
      id, to, amount, currency,
      ...(fee && { fee }),
      ...(idem && { idem }),
      ...(description && { description }),
      ...(skipNotifications && { 'skip_notifications': 'true' }),
      ...(toFinancialInstitution && { 'to_financial_institution': 'true' }),
      ...(financialInstitutionWebsite && { 'financial_institution_website': financialInstitutionWebsite })
    },
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(verify && { 'CB-2FA-TOKEN': verify }),
      ...version
    }
  };

  const response = await axios(config);
  return response.data as SendMoneyResponse;
};