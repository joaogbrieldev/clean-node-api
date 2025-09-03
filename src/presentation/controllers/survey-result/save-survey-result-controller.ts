import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { AcessDeniedError, InvalidParamError } from "@/presentation/errors";
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
      if (survey) {
        const answers = survey.answers.map((answer) => answer.answer);
        if (!answers.includes(httpRequest.body.answer)) {
          return forbidden(new InvalidParamError("answer"));
        }
      } else {
        return forbidden(new AcessDeniedError());
      }

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
