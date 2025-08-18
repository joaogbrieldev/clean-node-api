import { SignUpController } from "@/presentation/controllers/login/signup/signup-controller";
import { Controller } from "@/presentation/protocols";
import { makeDbAddAccount } from "./login/db-add-account-factory";
import { makeDbAuthentication } from "./login/db-authentication-factory";
import { makeLogControllerDecorator } from "./login/log-controller-decorator.factory";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );
  return makeLogControllerDecorator(signUpController);
};
