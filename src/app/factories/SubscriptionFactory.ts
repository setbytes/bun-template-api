import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { SubscriptionService } from "@/core/services/SubscriptionService";
import { JsonWebToken } from "@/infra/helpers/JsonWebToken";
import { UniqueCode } from "@/infra/helpers/UniqueCode";
import { StripePayment } from "@/infra/payments/StripePayment";

export class SubscriptionFactory {
  private constructor() {}

  public static createSubscriptionService(): SubscriptionService {
    const subscriptionRepository = DatabaseFactory.createSubscriptionRepository();
    const priceRepository = DatabaseFactory.createProductPriceRepository();
    const authToken = new JsonWebToken();
    const universallyUniqueIdentifier = new UniqueCode();
    const paymentSystem = new StripePayment();
    return new SubscriptionService(subscriptionRepository, priceRepository, authToken, universallyUniqueIdentifier, paymentSystem);
  }
}
