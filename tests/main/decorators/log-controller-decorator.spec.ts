import { LogErrorRepository } from "@/data/protocols/log-error-repository";
import { LogControllerDecorator } from "@/main/decorators/log";
import { serverError } from "@/presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

describe("LogControllerDecorator", () => {
  const makeSut = (): SutTypes => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
            passwordConfirmation: "any_password",
          },
        };
        return new Promise((resolve) => resolve(httpResponse));
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
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same result of the controller", async () => {
    const { sut, controllerStub } = makeSut();
    const httpResponse = await sut.handle({
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    });
    expect(httpResponse).toEqual(
      await controllerStub.handle({
        body: {
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
          passwordConfirmation: "any_password",
        },
      })
    );
  });

  test("should call LogErrorRepository with correct error if status code is 500", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(error as any)));

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(logErrorRepositoryStub.log).toHaveBeenCalledWith("any_stack");
  });
});
