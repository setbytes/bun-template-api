import { Request, Response } from "express";
import { SubscriptionDatabase } from "@/core/use-cases/database/SubscriptionDatabase";
import { ProductPriceDatabase } from "@/core/use-cases/database/ProductPriceDatabase";
import { AuthToken } from "@/core/use-cases/helpers/AuthToken";
import { UniqueIdentifier } from "@/core/use-cases/helpers/UniversallyUniqueIdentifier";
import { Authentication } from "@/core/models/Authentication";
import { environment } from "@/infra/configs/environment";
import { PaymentSystem, PaymentTypeEnum } from "@/core/use-cases/helpers/PaymentSystem";
import { PaymentStatusEnum, Subscription, SubscriptionStatusEnum } from "@/core/entities/Subscription";

export class SubscriptionService {
  public constructor(
    private readonly subscriptionRepository: SubscriptionDatabase,
    private readonly priceRepository: ProductPriceDatabase,
    private readonly jsonWebToken: AuthToken,
    private readonly uniqueIdentifier: UniqueIdentifier,
    private readonly paymentSystem: PaymentSystem
  ) { }

  public async handleCreateSubscriptionRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      const priceResponse = await this.priceRepository.findById(Number(request.body.priceId));
      if (priceResponse) {
        const referenceCode = this.uniqueIdentifier.generate();
        const [successToken, cancelToken] = await Promise.all([
          this.jsonWebToken.generate({ referenceCode, status: SubscriptionStatusEnum.APPROVED, paymentType: PaymentTypeEnum.SUBSCRIPTION }),
          this.jsonWebToken.generate({ referenceCode, status: SubscriptionStatusEnum.CANCELED, paymentType: PaymentTypeEnum.SUBSCRIPTION })
        ]);

        const integrationSessionResponse = await this.paymentSystem.createSubscription({ successToken, cancelToken, prices: [priceResponse] });
        const subscription = Subscription.createInstance(request.body, authentication.account);
        subscription.integrationSessionCode = integrationSessionResponse.integrationCode;
        subscription.referenceCode = referenceCode;
        subscription.product = priceResponse.product;
        const subscriptionResponse = await this.subscriptionRepository.save(subscription);
        const checkoutToken = await this.jsonWebToken.generate({ checkoutId: subscriptionResponse.id, publicKey: environment.STRIPE.PUBLIC_KEY, paymentType: PaymentTypeEnum.SUBSCRIPTION });
        response.status(201).json({ ...subscriptionResponse.toDto(), checkoutToken, redirectPaymentUrl: environment.INTERNAL_WEB.REDIRECT_PAYMENT + "/" + checkoutToken });
      } else {
        response.status(404).json({ status: false, message: "Product price not found" });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleFindAllSubscriptionRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      const subscription = Subscription.createInstance(request.query, authentication.account);
      const subscriptionResponse = await this.subscriptionRepository.findAll(subscription);
      response.status(200).json(subscriptionResponse.map(sub => sub.toDto()));
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleDeleteSubscriptionRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      let subscription = await this.subscriptionRepository.findById(Number(request.params.id));
      if (authentication.account.id == subscription.account.id) {
        await this.paymentSystem.deleteSubscription({ id: subscription.integrationCode });
        subscription = await this.subscriptionRepository.findById(Number(request.params.id));
        subscription.chargeStatus = PaymentStatusEnum.WAITING_CANCELATION;
        subscription = await this.subscriptionRepository.save(subscription);
        response.status(200).json(subscription.toDto());
      } else {
        response.status(403).json({ status: false, message: "Você não tem permissão para cancelar essa assinatura." });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }
}
