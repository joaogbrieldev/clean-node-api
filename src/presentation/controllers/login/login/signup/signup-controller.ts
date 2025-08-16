import { EmailInUseError } from "@/presentation/errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../../helpers/http/http-helper";
import {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
    this.addAccount = addAccount;
    this.validation = validation;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = httpRequest.body;

      const account = this.addAccount.add({
        name,
        email,
        password,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({
        email,
        password,
      });
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
