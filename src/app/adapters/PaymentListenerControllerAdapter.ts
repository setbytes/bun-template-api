import { Router } from "express";
import { ListenerFactory } from "@/app/factories/ListenerFactory";
import { JsonWebTokenMiddleware } from "../middlewares/JsonWebTokenMiddleware";
import { PaymentListenerService } from "@/core/services/PaymentListenerService";

export class PaymentListenerControllerAdapter {
  public static add(router: Router): void {
    /**
     * @swagger
     * definitions:
     *   IntegrationEnum:
     *     type: string
     *     enum:
     *       - "INTER"
     *       - "SICOOB"
     * components:
     *   securitySchemes:
     *     JWTAuth:
     *       type: apiKey
     *       in: header
     *       name: Authorization
     *       description: Enter your JWT token in the format 'Bearer {token}'
     */
    const paymentListenerService: PaymentListenerService = ListenerFactory.createPaymentListenerService();

    /**
     * @swagger
     * /v1/payments/listeners/{token}:
     *   post:
     *     tags:
     *       - Payment Controller
     *     summary: Receipt listeners event
     *     description: Receipts events from the integration
     *     parameters:
     *       - in: path
     *         name: token
     *         required: true
     *         schema:
     *           type: string
     *         description: JWT token
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 success: true
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Listener not found.
     */
    router.post("/v1/payments/listeners/:token", paymentListenerService.handlePaymentListenerEventRequest.bind(paymentListenerService));

    /**
     * @swagger
     * /v1/payments/listeners:
     *   post:
     *     summary: Create a listener for payment integration
     *     description: Endpoint to create a new webhook.
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Payment Controller
     *     responses:
     *       201:
     *         description: Subscription created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 integrationSecret:
     *                   type: string
     *                 integrationCode:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    router.post("/v1/payments/listeners", JsonWebTokenMiddleware.apply, paymentListenerService.handleCreatePaymentListenerRequest.bind(paymentListenerService));
  }
}
