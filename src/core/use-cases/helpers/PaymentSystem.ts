export interface PaymentSystem {
  createProduct(params: ProductParam): Promise<ProductResponse>;
  updateProduct(params: ProductParam): Promise<ProductResponse>;
  deleteProduct(params: ProductParam): Promise<ProductResponse>;
  createPrice(params: PriceParam): Promise<PriceResponse>;
  updatePrice(params: PriceParam): Promise<PriceResponse>;
  deletePrice(params: PriceParam): Promise<PriceResponse>;
  createPayment(params: PaymentParam): Promise<PaymentResponse>;
  createCheckout(params: CheckoutParam): Promise<CheckoutResponse>;
  createSubscription(params: SubscriptionParam): Promise<SubscriptionResponse>;
  deleteSubscription(params: SubscriptionParam): Promise<SubscriptionResponse>;
  createWebhook(params: WebhookParam): Promise<WebhookResponse>;
  decodeWebhookEvent(params: WebhookDecodeParam): Promise<WebhookPaymentDecodeResponse>;
  signatureWebhookEvent(request: any): Promise<string>;
}

export type WebhookDecodeParam = {
  signature: string
  payload: any
}

export type WebhookPaymentDecodeResponse = {
  event: WebhookPaymentEventEnum,
  integrationCode: string
}

export enum WebhookPaymentEventEnum {
  SUBSCRIPTION_CANCELLED = "SUBSCRIPTION_CANCELLED",
  CHECKOUT_CANCELLED = "CHECKOUT_CANCELLED",
  SESSION_COMPLETED = "SESSION_COMPLETED"
}

export type WebhookParam = {
  endpoint: string
}

export type ProductParam = {
  name?: string
  description?: string
  type?: "service" | "product" | "SERVICE" | "PRODUCT",
  integrationCode?: string
}

export type PriceParam = {
  productIntegrationCode?: string
  priceIntegrationCode?: string
  amount?: number
  currency?: PaymentCurrencyEnum
  interval?: PriceIntervalEnum
  intervalPeriod?: PriceIntervalPeriodEnum,
  intervalCount?: number
}

export type PaymentParam = {
  amount: number
  name: string
  currency: PaymentCurrencyEnum
  referenceCode: string
  metadata?: any,
  successToken?: string
  cancelToken?: string
};

export type CheckoutParam = {
  products?: Array<any>
  prices?: Array<any>
  paymentReference?: string
  successToken: string
  cancelToken: string
};

export type SubscriptionParam = {
  prices?: Array<any>
  successToken?: string
  cancelToken?: string
  id?: string
}

export type PaymentResponse = {
  url: string
  integrationCode: string
};

export type CheckoutResponse = {
  url: string
  integrationCode: string
};

export type SubscriptionResponse = {
  integrationCode: string
};

export type WebhookResponse = {
  integrationCode: string
  integrationSecret: string
};

export type ProductResponse = {
  integrationCode: string
}

export type PriceResponse = {
  integrationCode: string
}

export enum PriceIntervalEnum {
  ONE_TIME = "ONE_TIME",
  ON_GOING = "ON_GOING"
}

export enum PriceIntervalPeriodEnum {
  NONE = "NONE",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR"
}

export enum PaymentTypeEnum {
  PAYMENT = "PAYMENT", // a single payment
  CHECKOUT = "CHECKOUT", // more than one product
  SUBSCRIPTION = "SUBSCRIPTION" // a subscription for one product
}

export enum PaymentCurrencyEnum {
  BRL = "BRL",
  CAD = "CAD",
  USD = "USD"
}
