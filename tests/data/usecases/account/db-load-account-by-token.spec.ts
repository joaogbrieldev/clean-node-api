import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token";

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrupterStub: Decrypter;
};

class DecrypterSpy implements Decrypter {
  decrypt(value: string): Promise<string> {
    return Promise.resolve("any_value");
  }
}

const makeSut = (): SutTypes => {
  const decrupterStub = new DecrypterSpy();
  const sut = new DbLoadAccountByToken(decrupterStub);
  return {
    sut,
    decrupterStub,
  };
};

describe("DbLoadAccountByToken", () => {
  test("should call Decrypter with correct access token", async () => {
    const { sut, decrupterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrupterStub, "decrypt");
    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
