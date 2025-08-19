import { AccountModel } from "@/domain/models/account";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AcessDeniedError } from "@/presentation/errors";
import { forbidden } from "@/presentation/helpers/http/http-helper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { HttpRequest } from "@/presentation/protocols";

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load(accessToken: string): Promise<AccountModel> {
    return makeFakeAccount();
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

describe("AuthMiddleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httpRequest: HttpRequest = {
      headers: {
        authorization: "",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AcessDeniedError()));
  });
  test("should call LoadAccountByToken with correct accessToken", async () => {
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest: HttpRequest = {
      headers: {
        "x-access-token": "any_token",
      },
    };
    await sut.handle(httpRequest);
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith("any_token");
  });
});
