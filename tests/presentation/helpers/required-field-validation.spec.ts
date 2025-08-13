import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { RequiredFieldValidation } from "@/validation/validators/required-field-validation";

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation("field");
};

describe("RequiredFieldValidation", () => {
  it("should return error if field is empty", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return falsy if field is not empty", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
