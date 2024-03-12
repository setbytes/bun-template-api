import { Crypto } from "@/core/use-cases/helpers/Crypto";

export class BunBcrypt implements Crypto {
  async hash(text: string): Promise<string> {
    return Bun.password.hash(text);
  }

  async compare(text: string, encrypt: string): Promise<boolean> {
    return Bun.password.verify(text, encrypt);
  }
}
