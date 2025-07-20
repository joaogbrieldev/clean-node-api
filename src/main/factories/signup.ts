import { DbAddAccount } from "@/data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "@/infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account";
import { LogControllerDecorator } from "@/main/decorators/log";
import { SignUpController } from "@/presentation/controllers/signup/signup-controller";
import { Controller } from "@/presentation/protocols";
import { EmailValidatorAdapter } from "@/utils/email-validator";

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccount
  );
  return new LogControllerDecorator(signUpController);
};
