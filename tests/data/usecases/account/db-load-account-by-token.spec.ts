import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token";

describe("DbLoadAccountByToken", () => {
  class DecrypterSpy implements Decrypter {
    decrypt(value: string): Promise<string> {
      return Promise.resolve("any_value");
    }
  }

  test("should call Decrypter with correct access token", async () => {
    const decrupterStub = new DecrypterSpy();
    const decryptSpy = jest.spyOn(decrupterStub, "decrypt");
    const sut = new DbLoadAccountByToken(decrupterStub);
    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
