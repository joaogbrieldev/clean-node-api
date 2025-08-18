import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { DbAddSurvey } from "@/data/usecases/add-survey/db-add-survey";
import { AddSurveyModel } from "@/domain/usecases/add-survey";

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    return Promise.resolve();
  }
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe("DbAddSurvey UseCase", () => {
  const makeFakeSurvey = (): AddSurveyModel => ({
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  });

  test("should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSurveySpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = makeFakeSurvey();
    await sut.add(surveyData);
    expect(addSurveySpy).toHaveBeenCalledWith(surveyData);
  });

  test("should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());
    const promise = sut.add(makeFakeSurvey());
    await expect(promise).rejects.toThrow();
  });
});
