import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { AcessDeniedError } from "@/presentation/errors";
import {
  forbidden,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId
      );
      if (!survey) {
        return forbidden(new AcessDeniedError());
      }
      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
