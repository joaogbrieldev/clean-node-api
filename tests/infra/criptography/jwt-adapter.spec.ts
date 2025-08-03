import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockResolvedValue("any_token"),
}));

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret");
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  test("Should return a token if JwtAdapter encrypts successfully", async () => {
    const sut = new JwtAdapter("secret");
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });
});
