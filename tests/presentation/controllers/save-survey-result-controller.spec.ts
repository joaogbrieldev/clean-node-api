import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result-controller";
import { AcessDeniedError } from "@/presentation/errors";
import { forbidden } from "@/presentation/helpers/http/http-helper";
import { HttpRequest } from "@/presentation/protocols";

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: "any_survey_id",
    },
  };
};

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: "any_survey_id",
    question: "any_question",
    answers: [{ answer: "any_answer", image: "any_image" }],
    date: new Date(),
  };
};

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(surveyId: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub,
  };
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

describe("Save Survey Result Controller", () => {
  test("should call LoadSurveyById with correct value", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");
    await sut.handle(makeFakeRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });
  test("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AcessDeniedError()));
  });
});
