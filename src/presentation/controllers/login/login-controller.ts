import { InvalidParamError } from "@/presentation/errors/invalid-param-error";
import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { badRequest } from "@/presentation/helpers/http-helper";
import { HttpRequest, HttpResponse } from "@/presentation/protocols";
import { Controller } from "@/presentation/protocols/controller";
import { EmailValidator } from "@/presentation/protocols/email-validator";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError("password"));
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValid) {
      return badRequest(new InvalidParamError("email"));
    }
    return {
      statusCode: 200,
      body: "any_data",
    };
  }
}
