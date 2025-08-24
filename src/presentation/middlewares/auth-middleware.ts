import {
  AcessDeniedError,
  forbidden,
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
  Middleware,
  ok,
  serverError,
} from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        );
        if (!account) {
          return forbidden(new AcessDeniedError());
        }
        return ok({ accountId: account.id });
      }
      return new Promise((resolve) =>
        resolve(forbidden(new AcessDeniedError()))
      );
    } catch (error) {
      return serverError(error);
    }
  }
}
