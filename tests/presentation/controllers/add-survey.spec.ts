import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller";
import { HttpRequest } from "@/presentation/controllers/survey/add-survey/add-survey-controller-protocols";
import { badRequest } from "@/presentation/helpers/http/http-helper";
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
  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const validateSpy = jest.spyOn(validationStub, "validate");
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });
});
