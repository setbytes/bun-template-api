import Stripe from "stripe";
import { CheckoutParam, CheckoutResponse, PaymentCurrencyEnum, PaymentParam, PaymentResponse, PaymentSystem, PriceIntervalEnum, PriceParam, PriceResponse, ProductParam, ProductResponse, SubscriptionParam, SubscriptionResponse, WebhookDecodeParam, WebhookPaymentDecodeResponse, WebhookPaymentEventEnum, WebhookParam, WebhookResponse } from "@/core/use-cases/helpers/PaymentSystem";
import { environment } from "@/infra/configs/environment";

export class StripePayment implements PaymentSystem {
  private readonly stripeInstance: Stripe = new Stripe(environment.STRIPE.SECRET_KEY, { apiVersion: "2023-10-16" });

  public async createProduct(params: ProductParam): Promise<ProductResponse> {
    const stripeResponse = await this.stripeInstance.products.create({
      name: params.name,
      description: params.description,
      type: String(params.type).toLowerCase() == "service" ? "service" : "good"
    });
    return Promise.resolve({ integrationCode: stripeResponse.id });
  }

  public async updateProduct(params: ProductParam): Promise<ProductResponse> {
    const stripeResponse = await this.stripeInstance.products.update(params.integrationCode, { name: params.name, description: params.description });
    return Promise.resolve({ integrationCode: stripeResponse.id });
  }

  public async deleteProduct(params: ProductParam): Promise<ProductResponse> {
    const stripeResponse = await this.stripeInstance.products.update(params.integrationCode, { active: false });
    return Promise.resolve({ integrationCode: stripeResponse.id });
  }

  public async createPrice(params: PriceParam): Promise<PriceResponse> {
    const stripeResponse = await this.stripeInstance.prices.create({
      product: params.productIntegrationCode,
      unit_amount: Math.round(params.amount * 100),
      currency: params.currency || PaymentCurrencyEnum.BRL,
      recurring: params.interval == PriceIntervalEnum.ON_GOING ? {
        interval: String(params.intervalPeriod).toLowerCase() as any,
        interval_count: params.intervalCount || 1
      } : undefined
    });
    return Promise.resolve({ integrationCode: stripeResponse.id });
  }

  public async updatePrice(params: PriceParam): Promise<PriceResponse> {
    await this.stripeInstance.prices.update(params.priceIntegrationCode, { active: false });
    const createStripePriceResponse = await this.createPrice(params);
    return Promise.resolve(createStripePriceResponse);
  }

  public async deletePrice(params: PriceParam): Promise<PriceResponse> {
    const stripeResponse = await this.stripeInstance.prices.update(params.priceIntegrationCode, { active: false });
    return Promise.resolve({ integrationCode: stripeResponse.id });
  }

  public async createPayment(params: PaymentParam): Promise<PaymentResponse> {
    const paymentIntent = await this.stripeInstance.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: params.currency || PaymentCurrencyEnum.CAD,
          product_data: { name: params.name },
          unit_amount: params.amount * 100
        },
        quantity: 1
      }],
      success_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.successToken,
      cancel_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.cancelToken
    });
    return Promise.resolve({ integrationCode: paymentIntent.id, url: paymentIntent.url });
  }

  public async createCheckout(params: CheckoutParam): Promise<CheckoutResponse> {
    const paymentCheckout = await this.stripeInstance.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: params.prices.filter(price => price.interval == PriceIntervalEnum.ONE_TIME).map(price => ({ price: price.integrationCode, quantity: 1 })),
      success_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.successToken,
      cancel_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.cancelToken
    });
    return Promise.resolve({ integrationCode: paymentCheckout.id, url: paymentCheckout.url });
  }

  public async createSubscription(params: SubscriptionParam): Promise<SubscriptionResponse> {
    const paymentSubscription = await this.stripeInstance.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: params.prices.filter(price => price.interval == PriceIntervalEnum.ON_GOING).map(price => ({ price: price?.integrationCode, quantity: 1 })),
      success_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.successToken,
      cancel_url: environment.INTERNAL_WEB.CHECKOUT + "/" + params.cancelToken
    });
    return Promise.resolve({ integrationCode: paymentSubscription.id });
  }

  public async deleteSubscription(params: SubscriptionParam): Promise<SubscriptionResponse> {
    const paymentSubscription = await this.stripeInstance.subscriptions.update(params.id, {
      cancel_at_period_end: true
    });
    console.log("CANCEL SUBSCRIPTION", paymentSubscription);
    return Promise.resolve({ integrationCode: paymentSubscription.id });
  }

  public async createWebhook(params: WebhookParam): Promise<WebhookResponse> {
    const webhookResponse = await this.stripeInstance.webhookEndpoints.create({
      url: params.endpoint,
      enabled_events: ["customer.subscription.deleted", "checkout.session.expired", "checkout.session.completed"]
    });
    return Promise.resolve({ integrationCode: webhookResponse.id, integrationSecret: webhookResponse.secret });
  }

  public async decodeWebhookEvent(params: WebhookDecodeParam): Promise<WebhookPaymentDecodeResponse> {
    const eventMap = {
      "customer.subscription.deleted": WebhookPaymentEventEnum.SUBSCRIPTION_CANCELLED,
      "checkout.session.expired": WebhookPaymentEventEnum.CHECKOUT_CANCELLED,
      "checkout.session.completed": WebhookPaymentEventEnum.SESSION_COMPLETED
    };
    return Promise.resolve({ event: eventMap[params.payload.type], integrationCode: params.payload.data?.id || params.payload.data?.object?.id });
  }

  public async signatureWebhookEvent(request: any): Promise<any> {
    const stripeSignature = request.headers["stripe-signature"];
    return this.stripeInstance.webhooks.constructEventAsync(request.body, stripeSignature, environment.STRIPE.WEBHOOK_SECRET);
  }
}
