import { LoginController } from "@/presentation/controllers/login/login-controller";
import { Controller } from "@/presentation/protocols";
import { makeDbAuthentication } from "./db-authentication-factory";
import { makeLogControllerDecorator } from "./log-controller-decorator.factory";
import { makeLoginValidation } from "./login-validation";

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(loginController);
};
