import { WebStaticService } from "@/core/services/WebStaticService";
import { JsonWebToken } from "@/infra/helpers/JsonWebToken";
import { DatabaseFactory } from "@/app/factories/DatabaseFactory";

export class WebFactory {
  private constructor() {}

  public static createCheckoutService(): WebStaticService {
    const authToken = new JsonWebToken();
    const subscriptionRepository = DatabaseFactory.createSubscriptionRepository();
    return new WebStaticService(authToken, subscriptionRepository);
  }
}
