import { EmailValidatorAdapter } from "@/utils/email-validator";
import validator from "validator";

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("EmailValidator Adapter", () => {
  test("Should return false if validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
  test("Should return true if validator returns true", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(true);
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });
  test("Should call validator with correct email", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(true);
    sut.isValid("any_email@mail.com");
    expect(validator.isEmail).toHaveBeenCalledWith("any_email@mail.com");
  });
});
