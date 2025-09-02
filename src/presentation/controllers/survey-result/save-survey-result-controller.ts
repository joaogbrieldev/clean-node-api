import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return null;
  }
}
