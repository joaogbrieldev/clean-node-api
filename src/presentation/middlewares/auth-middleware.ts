import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import {
  HttpRequest,
  HttpResponse,
  Middleware,
} from "@/presentation/protocols";
import { AcessDeniedError } from "../errors";
import { forbidden, ok } from "../helpers/http/http-helper";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);
      if (!account) {
        return forbidden(new AcessDeniedError());
      }
      return ok({ accountId: account.id });
    }
    return new Promise((resolve) => resolve(forbidden(new AcessDeniedError())));
  }
}
