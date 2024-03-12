import { NextFunction, Request, Response } from "express";
import { Authentication } from "@/core/models/Authentication";
import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { JsonWebToken } from "@/infra/helpers/JsonWebToken";

export class JsonWebTokenMiddleware {
  public static async apply(request: Request & { authentication: any }, response: Response, next: NextFunction): Promise<any> {
    const accountRepository = DatabaseFactory.createAccountRepository();
    const authorization = request.get("Authorization") || request.cookies?.Authorization;
    if (authorization) {
      const [type, token] = authorization.split(" ");
      if (type == "Bearer") {
        const authToken = new JsonWebToken();
        const decodedToken = await authToken.decode(token);
        const account = await accountRepository.findById(decodedToken.id);
        if (!account) {
          return response.status(401).json({ status: false, message: "Invalid account" });
        }
        try {
          const isValidToken = await authToken.verify(token, account.secretKey);
          const authentication = new Authentication(isValidToken);
          authentication.account = account;
          request.authentication = authentication;
          return next();
        } catch (error) {
          return response.status(401).json({ status: false, message: "Invalid token" });
        }
      }
    }
    return response.status(401).json({ status: false, message: "Authorization header missing or invalid format" });
  }
}
