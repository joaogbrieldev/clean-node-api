import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { DbLoadSurveys } from "@/data/usecases/load-surveys/load-surveys";
import { SurveyModel } from "@/domain/models/survey";

describe("LoadSurveys UseCase", () => {
  const makeFakeSurveys = (): SurveyModel[] => {
    return [
      {
        id: "any_id",
        question: "any_question",
        answers: [
          {
            answer: "any_answer",
            image: "any_image",
          },
        ],
        date: new Date(),
      },
    ];
  };

  test("Should call LoadSurveysRepository", async () => {
    class LoadSurveysRepositorySpy implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        return makeFakeSurveys();
      }
    }
    const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, "loadAll");
    const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});
