import { Validator } from "@/core/use-cases/helpers/Validator";

export class PasswordValidator implements Validator {
  verify(input: Validator.Input): Validator.Output {
    const success = !((input.password.length < 4));
    const message = "password";
    return { success, message };
  }
}
