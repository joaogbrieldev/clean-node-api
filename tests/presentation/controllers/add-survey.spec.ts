import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller";
import {
  AddSurvey,
  AddSurveyModel,
  HttpRequest,
} from "@/presentation/controllers/survey/add-survey/add-survey-controller-protocols";
import {
  badRequest,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { Validation } from "@/validation/protocols/validation";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    validationStub,
    addSurveyStub,
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

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyStub();
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
  test("should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const addSurveySpy = jest.spyOn(addSurveyStub, "add");
    await sut.handle(httpRequest);
    expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(noContent());
  });
});
