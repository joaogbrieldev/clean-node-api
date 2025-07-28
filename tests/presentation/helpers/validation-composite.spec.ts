import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { ValidationComposite } from "@/presentation/helpers/validators/validation-composite";
import { Validation } from "./validators/validation";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

class ValidationStub implements Validation {
  validate(input: any): Error | null {
    return new MissingParamError("field");
  }
}

const makeSut = (): SutTypes => {
  const validationStubs = [new ValidationStub(), new ValidationStub()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  test("should return the first error if there are more than one error", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  test("should not return if validation succeeds", () => {
    const { sut, validationStubs } = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
