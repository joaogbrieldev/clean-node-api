import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { DbLoadSurveyById } from "@/data/usecases/load-survey-by-id/db-load-survey-by-id";
import { SurveyModel } from "@/domain/models/survey";
import MockDate from "mockdate";

beforeAll(() => {
  MockDate.set(new Date());
});
afterAll(() => {
  MockDate.reset();
});

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeFakeSurveys = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        answer: "any_answer",
        image: "any_image",
      },
    ],
    date: new Date(),
  };
};

const makeLoadSurveyByIdRepositorySpy = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return makeFakeSurveys();
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe("DbLoadSurveyById UseCase", () => {
  test("Should call LoadSurveyByIdRepository with correct values", () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    sut.loadById("any_id");
    expect(loadByIdSpy).toHaveBeenCalledWith("any_id");
  });
  test("Should return a survey on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById("any_id");
    expect(survey).toEqual(makeFakeSurveys());
  });
});
