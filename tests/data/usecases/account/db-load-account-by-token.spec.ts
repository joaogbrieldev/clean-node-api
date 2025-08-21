import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/load-account-by-token-repository";
import { DbLoadAccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token";
import { AccountModel } from "@/domain/models/account";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrupterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeDecrypter = (): Decrypter => {
  class DecrypterSpy implements Decrypter {
    decrypt(value: string): Promise<string> {
      return Promise.resolve("any_token");
    }
  }
  return new DecrypterSpy();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositorySpy
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenRepositorySpy();
};

const makeSut = (): SutTypes => {
  const decrupterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrupterStub,
    loadAccountByTokenRepositoryStub
  );
  return {
    sut,
    decrupterStub,
    loadAccountByTokenRepositoryStub,
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
  test("should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, "loadByToken");
    await sut.load("any_token", "any_role");
    expect(loadSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
});
