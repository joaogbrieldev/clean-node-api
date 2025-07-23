import { LoginController } from "@/presentation/controllers/login/login-controller";
import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { badRequest } from "@/presentation/helpers/http-helper";

describe("LoginController", () => {
  it("should return 400 if no email is provided", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
});
