import { WebhookEventEmitterService } from "@/core/services/WebhookEventEmitterService";

export class WebhookEventEmitterSingleton {
  private static instance: WebhookEventEmitterService;

  private constructor() {}

  public static getInstance(): WebhookEventEmitterService {
    if (!WebhookEventEmitterSingleton.instance) {
      WebhookEventEmitterSingleton.instance = new WebhookEventEmitterService();
    }
    return WebhookEventEmitterSingleton.instance;
  }
}
