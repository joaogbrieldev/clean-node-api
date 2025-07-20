import { LogControllerDecorator } from "@/main/decorators/log";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

describe("LogControllerDecorator", () => {
  test("should call handle with correct request", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
            passwordConfirmation: "any_password",
          },
        };
        return httpResponse;
      }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const sut = new LogControllerDecorator(controllerStub);
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
