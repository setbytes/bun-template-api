import { Validator } from "@/core/use-cases/helpers/Validator";
import { EmailValidator } from "@/infra/validators/EmailValidator";
import { NameValidator } from "@/infra/validators/NameValidator";
import { PasswordValidator } from "@/infra/validators/PasswordValidator";

export class ValidatorBuilder {
  private readonly validators: Array<Validator> = [];

  private constructor() {}

  public static builder(): ValidatorBuilder {
    return new ValidatorBuilder();
  }

  public name(): ValidatorBuilder {
    this.validators.push(new NameValidator());
    return this;
  }

  public email(): ValidatorBuilder {
    this.validators.push(new EmailValidator());
    return this;
  }

  public password(): ValidatorBuilder {
    this.validators.push(new PasswordValidator());
    return this;
  }

  public build(): Array<Validator> {
    return this.validators;
  }
}
