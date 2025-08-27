import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveys } from "@/domain/usecases/load-surveys";
import { LoadSurveysController } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller";
import { ok } from "@/presentation/helpers/http/http-helper";
import mockDate from "mockdate";

describe("LoadSurveysController", () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });

  interface SutTypes {
    sut: LoadSurveysController;
    loadSurveysSpy: LoadSurveys;
  }

  class LoadSurveysControllerStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  const makeSut = (): SutTypes => {
    const loadSurveysSpy = new LoadSurveysControllerStub();
    const sut = new LoadSurveysController(loadSurveysSpy);
    return {
      sut,
      loadSurveysSpy,
    };
  };
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
  test("Should call LoadSurveys with correct value", async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const loadSurveysSpySpy = jest.spyOn(loadSurveysSpy, "load");
    await sut.handle({});
    expect(loadSurveysSpySpy).toHaveBeenCalled();
  });
  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });
});
