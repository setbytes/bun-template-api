import { Request, Response } from "express";
import { PaymentSystem, WebhookPaymentEventEnum } from "@/core/use-cases/helpers/PaymentSystem";
import { SubscriptionDatabase } from "@/core/use-cases/database/SubscriptionDatabase";
import { PaymentStatusEnum, SubscriptionStatusEnum } from "@/core/entities/Subscription";
import { Authentication } from "@/core/models/Authentication";
import { PermissionRoleEnum } from "@/core/entities/Account";
import { environment } from "@/infra/configs/environment";

export class PaymentListenerService {
  public constructor(
    private readonly subscriptionRepository: SubscriptionDatabase,
    private readonly paymentSystem: PaymentSystem
  ) { }

  public async handlePaymentListenerEventRequest(request: Request, response: Response): Promise<any> {
    try {
      // const signature = await this.paymentSystem.signatureWebhookEvent(request);
      const webhookEventDecode = await this.paymentSystem.decodeWebhookEvent({ signature: null, payload: request.body });
      if (webhookEventDecode.event == WebhookPaymentEventEnum.SUBSCRIPTION_CANCELLED) {
        const subscriptionResponse = await this.subscriptionRepository.findByIntegrationCode(webhookEventDecode.integrationCode);
        if (subscriptionResponse) {
          subscriptionResponse.status = SubscriptionStatusEnum.CANCELED;
          subscriptionResponse.chargeStatus = PaymentStatusEnum.CANCELED;
          await this.subscriptionRepository.save(subscriptionResponse);
        }
      } else if (webhookEventDecode.event == WebhookPaymentEventEnum.CHECKOUT_CANCELLED) {
        // can be a single payment or a checkout with many items
      } else if (webhookEventDecode.event == WebhookPaymentEventEnum.SESSION_COMPLETED) {
        const subscription = await this.subscriptionRepository.findByIntegrationSessionCode(webhookEventDecode.integrationCode);
        subscription.integrationCode = request.body.data?.subscription || request.body.data?.object?.subscription;
        this.subscriptionRepository.save(subscription);
      }
      response.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleCreatePaymentListenerRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ADMINISTRATOR, PermissionRoleEnum.ROOT].includes(authentication.account.role)) {
        const webhookEndpoint = environment.INTERNAL_WEB.PAYMENT_WEBHOOK_LISTENER + "/" + new Date().getTime();
        const integrationResponse = await this.paymentSystem.createWebhook({ endpoint: webhookEndpoint });
        response.status(201).json(integrationResponse);
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }
}
