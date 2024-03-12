import { AccountService } from "@/core/services/AccountService";
import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { BunBcrypt } from "@/infra/helpers/BunBcrypt";
import { ValidatorBuilder } from "@/app/builders/ValidatorBuilder";
import { UniqueCode } from "@/infra/helpers/UniqueCode";

export class AccountFactory {
  public static createAccountService(): AccountService {
    // const encrypt = new Bcrypt();
    const encrypt = new BunBcrypt();
    const accountRepository = DatabaseFactory.createAccountRepository();
    const accountValidators = ValidatorBuilder.builder().name().email().password().build();
    const uniqueCode = new UniqueCode();
    return new AccountService(accountRepository, encrypt, accountValidators, uniqueCode);
  }
}
