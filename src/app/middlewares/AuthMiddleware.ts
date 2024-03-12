import { NextFunction, Request, Response } from "express";

const SERVER_TOKEN = "Bearer bXkgdG9rZW4gYmFzZSA2NA==";

export class AuthMiddleware {
  public static apply(request: Request, response: Response, next: NextFunction): any {
    const authorization = request.get("Authorization");
    if (authorization) {
      const [type, token] = authorization.split(" ");
      const [typeServe, tokenServer] = SERVER_TOKEN.split(" ");
      if (type == typeServe && token == tokenServer) {
        return next();
      }
    }
    return response.status(401).send();
  }
}
