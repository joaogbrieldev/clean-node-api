import { InvalidParamError } from "@/presentation/errors/invalid-param-error";
import { CompareFieldsValidation } from "@/validation/validators/compare-fields-validation";

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "fieldToCompare");
};

describe("CompareFieldsValidation", () => {
  it("should return error if compare is invalid", () => {
    const sut = new CompareFieldsValidation("field", "fieldToCompare");
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "other_value",
    });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });

  it("should return falsy if compare is valid", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });
    expect(error).toBeFalsy();
  });
  test("should not return if validation succeeds", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });
    expect(error).toBeFalsy();
  });
});
