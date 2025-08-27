import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { DbLoadSurveys } from "@/data/usecases/load-surveys/load-surveys";
import { SurveyModel } from "@/domain/models/survey";

describe("LoadSurveys UseCase", () => {
  interface SutTypes {
    sut: DbLoadSurveys;
    loadSurveysRepositorySpy: LoadSurveysRepository;
  }

  const makeLoadSurveysRepositorySpy = (): LoadSurveysRepository => {
    class LoadSurveysRepositorySpy implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        return makeFakeSurveys();
      }
    }
    return new LoadSurveysRepositorySpy();
  };
  const makeSut = (): SutTypes => {
    const loadSurveysRepositorySpy = makeLoadSurveysRepositorySpy();
    const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
    return {
      sut,
      loadSurveysRepositorySpy,
    };
  };
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
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});
