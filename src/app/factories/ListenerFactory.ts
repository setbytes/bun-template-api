import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { PaymentListenerService } from "@/core/services/PaymentListenerService";
import { StripePayment } from "@/infra/payments/StripePayment";

export class ListenerFactory {
  private constructor() {}

  public static createPaymentListenerService(): PaymentListenerService {
    const subscriptionRepository = DatabaseFactory.createSubscriptionRepository();
    const paymentSystem = new StripePayment();
    return new PaymentListenerService(subscriptionRepository, paymentSystem);
  }
}
