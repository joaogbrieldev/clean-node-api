import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { badRequest } from "@/presentation/helpers/http-helper";
import { HttpRequest, HttpResponse } from "@/presentation/protocols";
import { Controller } from "@/presentation/protocols/controller";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }

    return {
      statusCode: 200,
      body: "any_data",
    };
  }
}
