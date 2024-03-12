import { Validator } from "@/core/use-cases/helpers/Validator";

export class NameValidator implements Validator {
  verify(input: Validator.Input): Validator.Output {
    const success = !((input.password.length < 2));
    const message = "name";
    return { success, message };
  }
}
