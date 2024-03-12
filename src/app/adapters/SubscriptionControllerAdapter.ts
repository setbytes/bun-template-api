import { Router } from "express";
import { JsonWebTokenMiddleware } from "@/app/middlewares/JsonWebTokenMiddleware";
import { SubscriptionService } from "@/core/services/SubscriptionService";
import { SubscriptionFactory } from "@/app/factories/SubscriptionFactory";

export class SubscriptionControllerAdapter {
  public static add(router: Router): void {
    /**
     * @swagger
     * definitions:
     *   SubscriptionStatusEnum:
     *     type: string
     *     enum:
     *       - "PROCESSING"
     *       - "CANCELED"
     *       - "APPROVED"
     * components:
     *   securitySchemes:
     *     JWTAuth:
     *       type: apiKey
     *       in: header
     *       name: Authorization
     *       description: Enter your JWT token in the format 'Bearer {token}'
     */
    const subscriptionService: SubscriptionService = SubscriptionFactory.createSubscriptionService();

    /**
     * @swagger
     * /v1/subscriptions:
     *   post:
     *     summary: Create a new subscription
     *     description: Endpoint to create a new subscription.
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Subscription Controller
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               priceId:
     *                 type: number
     *     responses:
     *       201:
     *         description: Subscription created successfully
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 status: PROCESSING
     *                 checkoutToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
     *                 redirectPaymentUrl: https://dev.app.intopays.com/v1/redirect-payment/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    router.post("/v1/subscriptions", JsonWebTokenMiddleware.apply, subscriptionService.handleCreateSubscriptionRequest.bind(subscriptionService));

    /**
     * @swagger
     * /v1/subscriptions:
     *   get:
     *     tags:
     *       - Subscription Controller
     *     summary: Retrieve user subscriptions
     *     security:
     *       - JWTAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           $ref: '#/definitions/SubscriptionStatusEnum'
     *         description: Filter by subscription status
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               - id: 10
     *                 status: PROCESSING
     *                 createdAt: 2024-03-04T05:29:21.614Z
     *                 updatedAt: 2024-03-03T23:29:21.597Z
     *                 product:
     *                   id: 4
     *                   name: Sicredi Pix
     *                   description: Otimize suas operações financeiras com nosso plano de integração Pix para uma integração eficiente com a Sicredi.
     *                   serviceType: PIX
     *                   type: SERVICE
     *                   integrationType: SICREDI
     *                   createdAt: 2024-03-04T03:08:03.393Z
     *                   updatedAt: 2024-03-03T22:08:03.294Z
     *       '500':
     *         description: Internal server error
     */
    router.get("/v1/subscriptions", JsonWebTokenMiddleware.apply, subscriptionService.handleFindAllSubscriptionRequest.bind(subscriptionService));

    /**
     * @swagger
     * /v1/subscriptions/{id}:
     *   delete:
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Subscription Controller
     *     summary: Delete an subscription
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         description: The ID of the subscription
     *         required: true
     *     responses:
     *       '204':
     *         description: Subscription deleted successfully
     *       '401':
     *         description: Unauthorized - Invalid or missing JWT
     *       '403':
     *         description: Forbidden - Insufficient permissions
     *       '404':
     *         description: Subscription not found
     *       '500':
     *         description: Internal server error
     */
    router.delete("/v1/subscriptions/:id", JsonWebTokenMiddleware.apply, subscriptionService.handleDeleteSubscriptionRequest.bind(subscriptionService));
  }
}
