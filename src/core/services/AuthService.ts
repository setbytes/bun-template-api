import { AccountDatabase } from "@/core/use-cases/database/AccountDatabase";
import { Crypto } from "@/core/use-cases/helpers/Crypto";
import { AuthToken } from "@/core/use-cases/helpers/AuthToken";
import { Request, Response } from "express";

export class AuthService {
  constructor(
    private readonly accountRepository: AccountDatabase,
    private readonly encrypt: Crypto,
    private readonly authToken: AuthToken
  ) {}

  public async handleLoginRequest(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    try {
      const account = await this.accountRepository.findByEmail(email);
      if (!account) {
        response.status(401).json({ status: false, message: "Invalid credentials" });
      } else {
        const isCorrectPassword = await this.encrypt.compare(password, account.password);
        if (!isCorrectPassword) {
          response.status(401).json({ status: false, message: "Invalid credentials" });
        } else {
          const generateToken = await this.authToken.generate({ id: account.id, email: account.email }, account.secretKey);
          const token = "Bearer " + generateToken;
          const maxAgeInSeconds = (30 * 24 * 60 * 60) * 3; // 3 month
          response.setHeader("Set-Cookie", `Authorization=${token}; Path=/; Max-Age=${maxAgeInSeconds}; HttpOnly; Secure; SameSite=None`);
          response.status(200).header("Authorization", token).json({ token, account: account.toDto() });
        }
      }
    } catch (error) {
      response.status(500).json(error.message);
    }
  }

  public async handleLogoutRequest(request: Request, response: Response): Promise<void> {
    try {
      response.clearCookie("Authorization", { path: "/" });
      response.status(200).json({ message: "Logout successful" });
    } catch (error) {
      response.status(500).json(error.message);
    }
  }
}
