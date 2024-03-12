import { AuthToken } from "@/core/use-cases/helpers/AuthToken";
import Jwt from "jsonwebtoken";

export class JsonWebToken implements AuthToken {
  async generate(payload: any, secret?: string): Promise<string> {
    return Promise.resolve(Jwt.sign(payload, secret || DEFAULT_SECRET_KEY));
  }

  async decode(token: string): Promise<any> {
    return Promise.resolve(Jwt.decode(token) as any);
  }

  async verify(token: string, secret?: string): Promise<any> {
    return Promise.resolve(Jwt.verify(token, secret || DEFAULT_SECRET_KEY) as any);
  }
}

export const DEFAULT_SECRET_KEY = "template";
export const WEBHOOK_SECRET_KEY = "template-hook";
