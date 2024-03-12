import { Router } from "express";
import { WebFactory } from "@/app/factories/WebStaticFactory";
import { WebStaticService } from "@/core/services/WebStaticService";

export class WebStaticControllerAdapter {
  public static add(router: Router): void {
    const webService: WebStaticService = WebFactory.createCheckoutService();

    router.get("/v1/redirect-payment/:token", webService.handleRedirectPaymentRequest.bind(webService));

    router.get("/v1/checkout/:token", webService.handleCheckoutRequest.bind(webService));
  }
}
