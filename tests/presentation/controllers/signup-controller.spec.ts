import { AccountModel } from "@/domain/models/account";
import { SignUpController } from "@/presentation/controllers/signup/signup-controller";
import {
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from "@/presentation/controllers/signup/signup-protocols";
import { MissingParamError, ServerError } from "@/presentation/errors";
import {
  badRequest,
  ok,
  serverError,
} from "@/presentation/helpers/http-helper";

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  };
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

describe("SignUpController", () => {
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError("any_error")));
  });

  test("Should call AddAccount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = makeFakeRequest();
    sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
