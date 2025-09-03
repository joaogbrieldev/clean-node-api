import { SurveyModel } from "@/domain/models/survey";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from "@/domain/usecases/save-survey-result";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result-controller";
import { AcessDeniedError, InvalidParamError } from "@/presentation/errors";
import {
  forbidden,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { HttpRequest } from "@/presentation/protocols";
import mockDate from "mockdate";

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: "any_survey_id",
    },
    body: {
      answer: "any_answer",
    },
    accountId: "any_account_id",
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

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: "any_survey_result_id",
    surveyId: "any_survey_id",
    accountId: "any_account_id",
    answer: "any_answer",
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

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(
      surveyResult: SaveSurveyResultModel
    ): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }
  return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub();
  const saveSurveyResultStub = makeSaveSurveyResultStub();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

beforeEach(() => {
  mockDate.set(new Date());
});

afterEach(() => {
  mockDate.reset();
});

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
  test("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      params: {
        surveyId: "any_survey_id",
      },
      body: {
        answer: "invalid_answer",
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });
  test("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSurveyResultSpy = jest.spyOn(saveSurveyResultStub, "save");
    await sut.handle(makeFakeRequest());
    expect(saveSurveyResultSpy).toHaveBeenCalledWith({
      surveyId: "any_survey_id",
      accountId: "any_account_id",
      answer: "any_answer",
      date: new Date(),
    });
  });
  test("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
