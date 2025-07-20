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
        return {
          statusCode: 200,
          body: {
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
            passwordConfirmation: "any_password",
          },
        };
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
});
