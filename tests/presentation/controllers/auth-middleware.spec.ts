import { AcessDeniedError } from "@/presentation/errors";
import { forbidden } from "@/presentation/helpers/http/http-helper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { HttpRequest } from "@/presentation/protocols";

describe("AuthMiddleware", () => {
  it("should return 403 if no x-access-token exists in headers", async () => {
    const sut = new AuthMiddleware();
    const httpRequest: HttpRequest = {
      headers: {
        authorization: "",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AcessDeniedError()));
  });
});
