import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { ValidationComposite } from "@/presentation/helpers/validators/validation-composite";
import { Validation } from "./validators/validation";

interface SutTypes {
  sut: ValidationComposite;
  validationStub: ValidationStub;
}

class ValidationStub implements Validation {
  validate(input: any): Error | null {
    return new MissingParamError("field");
  }
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  const sut = new ValidationComposite([validationStub]);
  return {
    sut,
    validationStub,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
