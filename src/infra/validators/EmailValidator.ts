import { Validator } from "@/core/use-cases/helpers/Validator";
import validator from "validator";

export class EmailValidator implements Validator {
  verify(input: Validator.Input): Validator.Output {
    const success = validator.isEmail(input.email);
    const message = "email";
    return { success, message };
  }
}
