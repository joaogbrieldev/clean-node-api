import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller";
import { HttpRequest } from "@/presentation/controllers/survey/add-survey/add-survey-controller-protocols";
import { Validation } from "@/validation/protocols/validation";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
  };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: "any_question",
      answers: [{ image: "any_image" }, { answer: "any_answer" }],
    },
  };
};

describe("AddSurvey Controller", () => {
  test("Should call Validation with correct values", () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const validateSpy = jest.spyOn(validationStub, "validate");
    sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
