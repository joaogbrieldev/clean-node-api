import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveys } from "@/domain/usecases/load-surveys";
import { LoadSurveysController } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller";
import mockDate from "mockdate";

describe("LoadSurveysController", () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });
  const makeFakeSurveys = (): SurveyModel[] => {
    return [
      {
        id: "any_id",
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
        ],
        date: new Date(),
      },
    ];
  };
  test("Should call LoadSurveys with correct value", () => {
    class LoadSurveysControllerStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return [];
      }
    }
    const sut = new LoadSurveysController(new LoadSurveysControllerStub());
    const loadSurveysSpy = jest.spyOn(sut, "handle");
    sut.handle({});
    expect(loadSurveysSpy).toHaveBeenCalled();
  });
});
