import { Request, Response } from "express";
import { AuthToken } from "@/core/use-cases/helpers/AuthToken";
import { PaymentTypeEnum } from "@/core/use-cases/helpers/PaymentSystem";
import { SubscriptionDatabase } from "@/core/use-cases/database/SubscriptionDatabase";
import { PaymentStatusEnum, Subscription } from "@/core/entities/Subscription";

export class WebStaticService {
  constructor(
    private readonly jsonWebToken: AuthToken,
    private readonly subscriptionRepository: SubscriptionDatabase
  ) { }

  public async handleRedirectPaymentRequest(request: Request, response: Response): Promise<any> {
    try {
      const jsonWebTokenDecode = await this.jsonWebToken.verify(request.params.token);
      console.log(jsonWebTokenDecode);
      let checkoutResponse = null as any;
      if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.CHECKOUT) {
        // checkoutResponse = await this.checkoutRepository.findById(jsonWebTokenDecode.checkoutId);
        return response.status(403).json({ status: false, message: "Invalid token" });
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.PAYMENT) {
        // checkoutResponse = await this.paymentRepository.findById(jsonWebTokenDecode.checkoutId);
        return response.status(403).json({ status: false, message: "Invalid token" });
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.SUBSCRIPTION) {
        checkoutResponse = await this.subscriptionRepository.findById(jsonWebTokenDecode.checkoutId);
      } else {
        return response.status(403).json({ status: false, message: "Invalid token" });
      }
      response.render("redirect-payment", { title: "Intopays - Redirect Payment", publicKey: jsonWebTokenDecode.publicKey, sessionId: checkoutResponse.integrationSessionCode });
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleCheckoutRequest(request: Request, response: Response): Promise<any> {
    try {
      const jsonWebTokenDecode = await this.jsonWebToken.decode(request.params.token);
      let checkoutResponse = null as Subscription;
      if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.CHECKOUT) {
        // checkoutResponse = await this.checkoutRepository.findByReferenceCode(jsonWebTokenDecode.referenceCode);
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.PAYMENT) {
        // checkoutResponse = await this.paymentRepository.findByReferenceCode(jsonWebTokenDecode.referenceCode);
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.SUBSCRIPTION) {
        checkoutResponse = await this.subscriptionRepository.findByReferenceCode(jsonWebTokenDecode.referenceCode);
      } else {
        return response.status(403).json({ status: false, message: "Invalid token" });
      }
      checkoutResponse.status = jsonWebTokenDecode.status;

      if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.CHECKOUT) {
        // await this.checkoutRepository.save(checkoutResponse);
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.PAYMENT) {
        // await this.paymentRepository.save(checkoutResponse);
      } else if (jsonWebTokenDecode.paymentType == PaymentTypeEnum.SUBSCRIPTION) {
        checkoutResponse.chargeStatus = PaymentStatusEnum.RUNNING;
        await this.subscriptionRepository.save(checkoutResponse);
      }
      response.render("checkout", { title: "Intopays - Checkout", status: jsonWebTokenDecode.status, website: "https://intopays.com" });
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
