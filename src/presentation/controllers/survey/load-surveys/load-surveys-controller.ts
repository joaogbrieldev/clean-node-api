import { LoadSurveys } from "@/domain/usecases/load-surveys";
import { ok, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller } from "@/presentation/protocols";
import { HttpRequest, HttpResponse } from "@/presentation/protocols/http";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
