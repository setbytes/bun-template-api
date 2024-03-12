import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { BunBcrypt } from "@/infra/helpers/BunBcrypt";
import { AuthService } from "@/core/services/AuthService";
import { JsonWebToken } from "@/infra/helpers/JsonWebToken";

export class AuthFactory {
  public static createAuthService(): AuthService {
    const encrypt = new BunBcrypt();
    const authToken = new JsonWebToken();
    return new AuthService(DatabaseFactory.createAccountRepository(), encrypt, authToken);
  }
}
