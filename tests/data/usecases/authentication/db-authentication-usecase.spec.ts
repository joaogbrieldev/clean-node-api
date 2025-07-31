import { HashComparer } from "@/data/protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/load-account-by-email-repository";
import { DBAuthentication } from "@/data/usecases/authentication/db-authentication";
import { AuthenticationModel } from "@/domain/usecases/authentication";
import { AccountModel } from "../add-account/db-add-account-protocols";

describe("DBAuthenticationUsecase", () => {
  type SutTypes = {
    sut: DBAuthentication;
    hashComparer: HashComparerStub;
    loadAccountByEmailRepository: LoadAccountByEmailRepositorySpy;
  };

  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  class LoadAccountByEmailRepositorySpy
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  const makeFakeAccount = (): AccountModel => {
    return {
      id: "any_id",
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    };
  };

  const makeSut = (): SutTypes => {
    const hashComparer = new HashComparerStub();
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositorySpy();
    const sut = new DBAuthentication(
      loadAccountByEmailRepository,
      hashComparer
    );
    return {
      sut,
      loadAccountByEmailRepository,
      hashComparer,
    };
  };

  const makeFakeAuthentication = (): AuthenticationModel => {
    return {
      email: "any_email@mail.com",
      password: "any_password",
    };
  };

  test("should return an authentication model", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email);
  });

  test("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepository, "load")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepository, "load")
      .mockResolvedValueOnce(null);
    const authentication = await sut.auth(makeFakeAuthentication());
    expect(authentication).toBeNull();
  });
  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparer } = makeSut();
    const hashComparerSpy = jest.spyOn(hashComparer, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(hashComparerSpy).toHaveBeenCalledWith(
      makeFakeAuthentication().password,
      makeFakeAccount().password
    );
  });
});
