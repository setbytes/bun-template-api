import { Router } from "express";
import { AccountService } from "@/core/services/AccountService";
import { AccountFactory } from "@/app/factories/AccountFactory";
import { JsonWebTokenMiddleware } from "@/app/middlewares/JsonWebTokenMiddleware";

export class AccountControllerAdapter {
  public static add(router: Router): void {
    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     JWTAuth:
     *       type: apiKey
     *       in: header
     *       name: Authorization
     *       description: Enter your JWT token in the format 'Bearer {token}'
     */
    const accountService: AccountService = AccountFactory.createAccountService();

    /**
     * @swagger
     * /v1/accounts:
     *   get:
     *     tags:
     *       - Account Controller
     *     summary: Retrieve user accounts
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter accounts by name
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               - id: 1
     *                 name: John Doe
     *                 email: john.doe@example.com
     *               - id: 2
     *                 name: Jane Doe
     *                 email: jane.doe@example.com
     *       '500':
     *         description: Internal server error
     */
    router.get("/v1/accounts", accountService.handleFindAllAccountRequest.bind(accountService));

    /**
     * @swagger
     * /v1/accounts/{id}:
     *   get:
     *     tags:
     *       - Account Controller
     *     summary: Retrieve a user account by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         description: The ID of the account to retrieve
     *         required: true
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               id: 1
     *               name: John Doe
     *               email: john.doe@example.com
     *       '404':
     *         description: Account not found
     *       '500':
     *         description: Internal server error
     */
    router.get("/v1/accounts/:id", accountService.handleFindByIdRequest.bind(accountService));

    /**
     * @swagger
     * /v1/accounts:
     *   post:
     *     tags:
     *       - Account Controller
     *     summary: Create a new account
     *     description: Create a new account with the specified email and password.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               name:
     *                 type: string
     *               password:
     *                 type: string
     *             required:
     *               - email
     *               - password
     *     responses:
     *       201:
     *         description: Account created successfully
     *       400:
     *         description: Bad request (e.g., invalid email or password format)
     */
    router.post("/v1/accounts", accountService.handleCreateAccountRequest.bind(accountService));

    /**
     * @swagger
     * /v1/accounts:
     *   put:
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Account Controller
     *     summary: Update an account
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
     *                 description: The name of the account holder
     *               email:
     *                 type: string
     *                 format: email
     *                 description: The email address of the account holder
     *               password:
     *                 type: string
     *                 description: The password for the account
     *             required:
     *               - name
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Account updated successfully
     *       400:
     *         description: Bad request, check the request body for errors
     *       500:
     *         description: Internal server error
     */
    router.put("/v1/accounts", JsonWebTokenMiddleware.apply, accountService.handleUpdateAccountRequest.bind(accountService));

    /**
     * @swagger
     * /v1/accounts:
     *   delete:
     *     security:
     *       - JWTAuth: []
     *     tags:
     *       - Account Controller
     *     summary: Delete an account
     *     responses:
     *       '204':
     *         description: Account deleted successfully
     *       '401':
     *         description: Unauthorized - Invalid or missing JWT
     *       '403':
     *         description: Forbidden - Insufficient permissions
     *       '404':
     *         description: Account not found
     *       '500':
     *         description: Internal server error
     */
    router.delete("/v1/accounts", JsonWebTokenMiddleware.apply, accountService.handleDeleteAccountRequest.bind(accountService));
  }
}
