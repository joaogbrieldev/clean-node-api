import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { RequiredFieldValidation } from "@/presentation/helpers/validators/required-field-validation";

describe("RequiredFieldValidation", () => {
  it("should return error if field is empty", () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ field: "" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return falsy if field is not empty", () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
