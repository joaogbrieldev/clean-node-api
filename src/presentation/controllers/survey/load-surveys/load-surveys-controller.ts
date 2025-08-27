import { LoadSurveys } from "@/domain/usecases/load-surveys";
import { Controller } from "@/presentation/protocols";
import { HttpRequest, HttpResponse } from "@/presentation/protocols/http";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return null;
  }
}
