import { DBAuthentication } from "@/data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "@/infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "@/infra/db/mongodb/log-repository/log";
import env from "@/main/config/env";
import { LogControllerDecorator } from "@/main/decorators/log";
import { LoginController } from "@/presentation/controllers/login/login-controller";
import { Controller } from "@/presentation/protocols";
import { makeLoginValidation } from "./login-validation";

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const logMongoRepository = new LogMongoRepository();
  const dbAuthentication = new DBAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );
  return new LogControllerDecorator(loginController, logMongoRepository);
};
