import { EmailValidatorAdapter } from "@/utils/email-validator";
import { Validation } from "@/validation/protocols/validation";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
