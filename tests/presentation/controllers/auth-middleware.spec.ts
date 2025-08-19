import { AccountModel } from "@/domain/models/account";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AcessDeniedError } from "@/presentation/errors";
import { forbidden } from "@/presentation/helpers/http/http-helper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { HttpRequest } from "@/presentation/protocols";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

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

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      "x-access-token": "any_token",
    },
  };
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe("AuthMiddleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = makeFakeRequest();
    httpRequest.headers["x-access-token"] = "";
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AcessDeniedError()));
  });
  test("should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest: HttpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith("any_token");
  });
  test("should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest: HttpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AcessDeniedError()));
  });
});
