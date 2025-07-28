import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { ValidationComposite } from "@/presentation/helpers/validators/validation-composite";
import { Validation } from "./validators/validation";

describe("ValidationComposite", () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return new MissingParamError("field");
    }
  }
  test("should return an error if any validation fails", () => {
    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
