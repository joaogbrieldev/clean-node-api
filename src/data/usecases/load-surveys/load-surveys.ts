import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveys } from "@/domain/usecases/load-surveys";

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    try {
      const surveys = await this.loadSurveysRepository.loadAll();
      return surveys;
    } catch (error) {
      throw new Error(error);
    }
  }
}
