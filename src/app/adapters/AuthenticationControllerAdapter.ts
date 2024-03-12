import { Router } from "express";
import { AuthService } from "@/core/services/AuthService";
import { AuthFactory } from "@/app/factories/AuthFactory";

export class AuthenticationControllerAdapter {
  public static add(router: Router): void {
    const authService: AuthService = AuthFactory.createAuthService();

    /**
     * @swagger
     * /v1/authentication:
     *   post:
     *     tags:
     *       - Authentication Controller
     *     summary: Authenticate user
     *     description: Authenticate a user using email and password.
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
     *               password:
     *                 type: string
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Successful authentication
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Invalid credentials
     */
    router.post("/v1/authentication", authService.handleLoginRequest.bind(authService));

    /**
     * @swagger
     * /v1/authentication:
     *   delete:
     *     tags:
     *       - Authentication Controller
     *     summary: Logout user
     *     description: Make the logout of the user
     *     responses:
     *       200:
     *         description: Successful logout
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Invalid credentials
     */
    router.delete("/v1/authentication", authService.handleLogoutRequest.bind(authService));
  }
}
