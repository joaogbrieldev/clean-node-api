import { LoginController } from "@/presentation/controllers/login/login-controller";
import {
  Authentication,
  EmailValidator,
  HttpRequest,
} from "@/presentation/controllers/login/login-protocols";
import { InvalidParamError, MissingParamError } from "@/presentation/errors";
import {
  badRequest,
  serverError,
  unauthorized,
} from "@/presentation/helpers/http-helper";

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: "any_email@mail.com",
      password: "any_password",
    },
  };
};
interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe("LoginController", () => {
  it("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    httpRequest.body.email = "invalid_email@mail.com";
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });
  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authenticationSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
  });
  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });
});
