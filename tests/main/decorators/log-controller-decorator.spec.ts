import { LogErrorRepository } from "@/data/protocols/log-error-repository";
import { AccountModel } from "@/domain/models/account";
import { LogControllerDecorator } from "@/main/decorators/log";
import { ok, serverError } from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeFakeError = (): Error => {
  const error = new Error();
  error.stack = "any_stack";
  return error;
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

describe("LogControllerDecorator", () => {
  const makeSut = (): SutTypes => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve) => resolve(ok(makeFakeAccount())));
      }
    }
    const controllerStub = new ControllerStub();
    const logErrorRepositoryStub = makeLogErrorRepository();
    const sut = new LogControllerDecorator(
      controllerStub,
      logErrorRepositoryStub
    );
    return {
      sut,
      controllerStub,
      logErrorRepositoryStub,
    };
  };

  const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
      async log(stack: string): Promise<void> {
        return new Promise((resolve) => resolve());
      }
    }
    return new LogErrorRepositoryStub();
  };

  test("should call handle with correct request", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same result of the controller", async () => {
    const { sut, controllerStub } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      await controllerStub.handle(makeFakeRequest())
    );
  });

  test("should call LogErrorRepository with correct error if status code is 500", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const error = serverError(makeFakeError());
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(error as any)));
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(logErrorRepositoryStub.log).toHaveBeenCalledWith("any_stack");
  });
});
