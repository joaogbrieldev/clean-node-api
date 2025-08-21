import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/load-account-by-token";
import { DbLoadAccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token";

type SutTypes = {
  sut: LoadAccountByTokenRepository;
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
    await sut.load("any_token", "any_role");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
  test("should return null if Decrypter returns null", async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, "load").mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });
});
