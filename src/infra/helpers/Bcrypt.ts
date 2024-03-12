import { Crypto } from "@/core/use-cases/helpers/Crypto";
import bcrypt from "bcrypt";

export class Bcrypt implements Crypto {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, SALT);
  }

  async compare(text: string, encrypt: string): Promise<boolean> {
    return bcrypt.compare(text, encrypt);
  }
}

export const SALT = 10;
