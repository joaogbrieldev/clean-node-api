import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter";
import jwt from "jsonwebtoken";

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
};

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockResolvedValue("any_token"),
  verify: jest.fn().mockResolvedValue("any_value"),
}));

describe("Jwt Adapter", () => {
  describe("sign", () => {
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
  describe("verify", () => {
    test("Should call verify with correct values", async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("any_token");
      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });
    test("Should return a value if verify succeeds", async () => {
      const sut = makeSut();
      const value = await sut.decrypt("any_token");
      expect(value).toBe("any_value");
    });
    test("Should throw if verify throws", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
        throw new Error("verify_error");
      });
      const promise = sut.decrypt("any_token");
      await expect(promise).rejects.toThrow(new Error("verify_error"));
    });
  });
});
