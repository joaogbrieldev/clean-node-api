import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter";
import jwt from "jsonwebtoken";

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
};

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockResolvedValue("any_token"),
}));

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  test("Should return a token if JwtAdapter encrypts successfully", async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });

  test("Should throw if sign throws", async () => {
    const sut = makeSut();
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error("sign_error");
    });
    const promise = sut.encrypt("any_id");
    await expect(promise).rejects.toThrow(new Error("sign_error"));
  });
});
