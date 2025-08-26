import {
  AddSurvey,
  AddSurveyModel,
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/controllers/survey/add-survey/add-survey-controller-protocols";
import {
  badRequest,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { Validation } from "@/validation/protocols/validation";

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      const surveyData: AddSurveyModel = {
        question,
        answers,
        date: new Date(),
      };
      await this.addSurvey.add(surveyData);
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
