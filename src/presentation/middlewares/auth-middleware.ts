import {
  HttpRequest,
  HttpResponse,
  Middleware,
} from "@/presentation/protocols";
import { AcessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) => resolve(forbidden(new AcessDeniedError())));
  }
}
