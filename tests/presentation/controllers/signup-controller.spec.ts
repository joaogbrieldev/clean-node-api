import { AccountModel } from "@/domain/models/account";
import { SignUpController } from "@/presentation/controllers/signup/signup-controller";
import {
  AddAccount,
  AddAccountModel,
  EmailValidator,
} from "@/presentation/controllers/signup/signup-protocols";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "@/presentation/errors";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      };
      return Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe("SignUpController", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no passwordConfirmation is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if password confirmation does not match", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "wrong_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.handle({
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should return 500 if EmailValidator throws", () => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    const httpResponse = sut.handle({
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    });
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test("Should call AddAccount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });
});
