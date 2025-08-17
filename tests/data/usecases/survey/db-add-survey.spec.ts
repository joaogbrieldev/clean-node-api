import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { DbAddSurvey } from "@/data/usecases/add-survey/db-add-survey";
import { AddSurveyModel } from "@/domain/usecases/add-survey";

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

  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve();
    }
  }

  test("should call AddSurveyRepository with correct values", async () => {
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    const addSurveySpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = makeFakeSurvey();
    await sut.add(surveyData);
    expect(addSurveySpy).toHaveBeenCalledWith(surveyData);
  });
});
