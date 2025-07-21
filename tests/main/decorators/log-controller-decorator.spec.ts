import { LogControllerDecorator } from "@/main/decorators/log";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
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
    const sut = new LogControllerDecorator(controllerStub);
    return {
      sut,
      controllerStub,
    };
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
});
