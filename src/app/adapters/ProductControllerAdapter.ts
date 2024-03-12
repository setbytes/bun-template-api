import { Router } from "express";
import { JsonWebTokenMiddleware } from "@/app/middlewares/JsonWebTokenMiddleware";
import { ProductFactory } from "@/app/factories/ProductFactory";
import { ProductService } from "@/core/services/ProductService";

export class ProductControllerAdapter {
  public static add(router: Router): void {
    /**
     * @swagger
     * definitions:
     *   CurrencyEnum:
     *     type: string
     *     enum:
     *       - "BRL"
     *       - "CAD"
     *       - "USD"
     *   PriceIntervalEnum:
     *     type: string
     *     enum:
     *       - "ON_GOING"
     *       - "ONE_TIME"
     *   ProductTypeEnum:
     *     type: string
     *     enum:
     *       - "SERVICE"
     *       - "PRODUCT"
     *   PriceIntervalPeriodEnum:
     *     type: string
     *     enum:
     *       - "MONTH"
     *       - "WEEK"
     *       - "DAY"
     *       - "YEAR"
     *   IntegrationEnum:
     *     type: string
     *     enum:
     *       - "SICOOB"
     *       - "INTER"
     *       - "SANTANDER"
     *       - "SICREDI"
     *   ServiceTypeEnum:
     *     type: string
     *     enum:
     *       - "PIX"
     *       - "BOLETO"
     *       - "FULL"
     * components:
     *   securitySchemes:
     *     JWTAuth:
     *       type: apiKey
     *       in: header
     *       name: Authorization
     *       description: Enter your JWT token in the format 'Bearer {token}'
     */
    const productService: ProductService = ProductFactory.createProductService();

    /**
     * @swagger
     * /v1/products:
     *   post:
     *     tags:
     *       - Product Controller
     *     summary: Create a new product
     *     description: Create a new product to subscription
     *     security:
     *       - JWTAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               integrationType:
     *                 $ref: '#/definitions/IntegrationEnum'
     *               serviceType:
     *                 $ref: '#/definitions/ServiceTypeEnum'
     *               type:
     *                 $ref: '#/definitions/ProductTypeEnum'
     *               amount:
     *                 type: number
     *                 example:
     *                    9.99
     *               intervalCount:
     *                 type: number
     *                 example:
     *                    1
     *               interval:
     *                 $ref: '#/definitions/PriceIntervalEnum'
     *               intervalPeriod:
     *                 $ref: '#/definitions/PriceIntervalPeriodEnum'
     *               currency:
     *                 $ref: '#/definitions/CurrencyEnum'
     *             required:
     *               - amount
     *               - name
     *               - currency
     *     responses:
     *       201:
     *         description: Product created successfully
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 name: Banco Inter Pix
     *                 description: Integracao com banco inter para uso do Pix.
     *                 integrationType: SANTANDER
     *                 serviceType: PIX
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *                 prices:
     *                    - id: 1
     *                      amount: 100.99
     *                      currency: BRL
     *                      createdAt: 2023-11-28T20:56:32.003Z
     *                      updatedAt: 2023-11-28T20:56:32.003Z
     *       400:
     *         description: Bad request (e.g., invalid data)
     */
    router.post("/v1/products", JsonWebTokenMiddleware.apply, productService.handleProductCreateRequest.bind(productService));

    /**
     * @swagger
     * /v1/products:
     *   get:
     *     tags:
     *       - Product Controller
     *     summary: Retrieve user products
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter products by name
     *       - in: query
     *         name: description
     *         schema:
     *           type: string
     *         description: Filter products by description
     *       - in: query
     *         name: serviceType
     *         schema:
     *           $ref: '#/definitions/ServiceTypeEnum'
     *         description: Filter by service type
     *       - in: query
     *         name: integrationType
     *         schema:
     *           $ref: '#/definitions/IntegrationEnum'
     *         description: Filter by integration type
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               - id: 1
     *                 name: Banco Inter Pix
     *                 description: Integracao com banco inter para uso do Pix.
     *                 integrationType: SANTANDER
     *                 serviceType: PIX
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *                 prices:
     *                    - id: 1
     *                      amount: 100.99
     *                      currency: BRL
     *                      createdAt: 2023-11-28T20:56:32.003Z
     *                      updatedAt: 2023-11-28T20:56:32.003Z
     *       '500':
     *         description: Internal server error
     */
    router.get("/v1/products", productService.handleFindAllProductRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}:
     *   get:
     *     tags:
     *       - Product Controller
     *     summary: Retrieve a user product by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         description: The ID of the product to retrieve
     *         required: true
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 name: Banco Inter Pix
     *                 description: Integracao com banco inter para uso do Pix.
     *                 integrationType: SANTANDER
     *                 serviceType: PIX
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *                 prices:
     *                    - id: 1
     *                      amount: 100.99
     *                      currency: BRL
     *                      createdAt: 2023-11-28T20:56:32.003Z
     *                      updatedAt: 2023-11-28T20:56:32.003Z
     *       '404':
     *         description: Credential not found
     *       '500':
     *         description: Internal server error
     */
    router.get("/v1/products/:id", productService.handleFindProductByIdRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}:
     *   delete:
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Product Controller
     *     summary: Retrieve a user product by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         description: The ID of the product to retrieve
     *         required: true
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 name: Banco Inter Pix
     *                 description: Integracao com banco inter para uso do Pix.
     *                 integrationType: SANTANDER
     *                 serviceType: PIX
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *                 prices:
     *                    - id: 1
     *                      amount: 100.99
     *                      currency: BRL
     *                      createdAt: 2023-11-28T20:56:32.003Z
     *                      updatedAt: 2023-11-28T20:56:32.003Z
     *       '404':
     *         description: Credential not found
     *       '500':
     *         description: Internal server error
     */
    router.delete("/v1/products/:id", JsonWebTokenMiddleware.apply, productService.handleDeleteProductRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}:
     *   put:
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Product Controller
     *     summary: Update a credential
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         description: The ID of the credential to retrieve
     *         required: true
     *     requestBody:
     *       description: Account details to be updated
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *                 format: email
     *               integrationType:
     *                 $ref: '#/definitions/IntegrationEnum'
     *               serviceType:
     *                 $ref: '#/definitions/ServiceTypeEnum'
     *               type:
     *                 $ref: '#/definitions/ProductTypeEnum'
     *             required:
     *               - name
     *               - description
     *               - integrationType
     *               - serviceType
     *               - type
     *     responses:
     *       200:
     *         description: Account updated successfully
     *       400:
     *         description: Bad request, check the request body for errors
     *       500:
     *         description: Internal server error
     */
    router.put("/v1/products/:id", JsonWebTokenMiddleware.apply, productService.handleUpdateProductRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}/prices:
     *   get:
     *     tags:
     *       - Product Controller
     *     summary: Get prices for a product
     *     description: Retrieves prices associated with a specific product.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the product for which prices are to be retrieved.
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               - id: 1
     *                 amount: 100.99
     *                 currency: CAD
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Product not found.
     */
    router.get("/v1/products/:id/prices", productService.handleFindAllPriceRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}/prices:
     *   post:
     *     tags:
     *       - Product Controller
     *     security:
     *       - JWTAuth: []
     *     summary: Create prices for a product
     *     description: Retrieves prices associated with a specific product.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the product for which prices are to be retrieved.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: number
     *                 example:
     *                    9.99
     *               currency:
     *                 $ref: '#/definitions/CurrencyEnum'
     *               interval:
     *                 $ref: '#/definitions/PriceIntervalEnum'
     *               intervalPeriod:
     *                 $ref: '#/definitions/PriceIntervalPeriodEnum'
     *             required:
     *               - amount
     *               - name
     *               - currency
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               - id: 1
     *                 amount: 100.99
     *                 currency: CAD
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Product not found.
     */
    router.post("/v1/products/:id/prices", JsonWebTokenMiddleware.apply, productService.handleCreatePriceRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}/prices/{priceId}:
     *   get:
     *     tags:
     *       - Product Controller
     *     summary: Get prices for a product
     *     description: Retrieves prices associated with a specific product.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the product.
     *       - in: path
     *         name: priceId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the price to be retrieved.
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 amount: 100.99
     *                 currency: CAD
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Product not found.
     */
    router.get("/v1/products/:id/prices/:priceId", productService.handleFindPriceByIdRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}/prices/{priceId}:
     *   put:
     *     tags:
     *       - Product Controller
     *     security:
     *       - JWTAuth: []
     *     summary: Update the price of a product
     *     description: |
     *       Updates the price associated with a specific product.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the product.
     *       - in: path
     *         name: priceId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the price to be updated.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           example:
     *             amount: 120.98
     *             currency: CAD
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 amount: 100.99
     *                 currency: BRL
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Product or price not found.
     */
    router.put("/v1/products/:id/prices/:priceId", JsonWebTokenMiddleware.apply, productService.handleUpdatePriceRequest.bind(productService));

    /**
     * @swagger
     * /v1/products/{id}/prices/{priceId}:
     *   delete:
     *     tags:
     *       - Product Controller
     *     security:
     *       - JWTAuth: []
     *     summary: Delete the price of a product
     *     description: |
     *       Updates the price associated with a specific product.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the product.
     *       - in: path
     *         name: priceId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the price to be updated.
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *                 id: 1
     *                 amount: 100.99
     *                 currency: BRL
     *                 createdAt: 2023-11-28T20:56:32.003Z
     *                 updatedAt: 2023-11-28T20:56:32.003Z
     *       '401':
     *         description: Unauthorized. Token is missing or invalid.
     *       '404':
     *         description: Product or price not found.
     */
    router.delete("/v1/products/:id/prices/:priceId", JsonWebTokenMiddleware.apply, productService.handleDeletePriceRequest.bind(productService));
  }
}
