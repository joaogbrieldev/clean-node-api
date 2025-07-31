import { HashComparer } from "@/data/protocols/criptography/hash-comparer";
import { TokenGenerator } from "@/data/protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/update-access-token-repository";
import { DBAuthentication } from "@/data/usecases/authentication/db-authentication";
import { AuthenticationModel } from "@/domain/usecases/authentication";
import { AccountModel } from "../add-account/db-add-account-protocols";

describe("DBAuthenticationUsecase", () => {
  type SutTypes = {
    sut: DBAuthentication;
    hashComparer: HashComparerStub;
    loadAccountByEmailRepository: LoadAccountByEmailRepositorySpy;
    tokenGenerator: TokenGeneratorStub;
    updateAccessTokenRepository: UpdateAccessTokenRepositorySpy;
  };

  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
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
    const tokenGenerator = new TokenGeneratorStub();
    const updateAccessTokenRepository = new UpdateAccessTokenRepositorySpy();
    const sut = new DBAuthentication(
      loadAccountByEmailRepository,
      hashComparer,
      tokenGenerator,
      updateAccessTokenRepository
    );
    return {
      sut,
      loadAccountByEmailRepository,
      hashComparer,
      tokenGenerator,
      updateAccessTokenRepository,
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

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparer } = makeSut();
    jest.spyOn(hashComparer, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparer } = makeSut();
    jest.spyOn(hashComparer, "compare").mockResolvedValueOnce(false);
    const authentication = await sut.auth(makeFakeAuthentication());
    expect(authentication).toBeNull();
  });
  test("should call TokenGenerator with correct value", async () => {
    const { sut, tokenGenerator } = makeSut();
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(tokenGeneratorSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });
  test("should return the accessToken on success", async () => {
    const { sut, tokenGenerator } = makeSut();
    const generateSpy = jest.spyOn(tokenGenerator, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });
  test("should return the accessToken on success", async () => {
    const { sut, tokenGenerator } = makeSut();
    const generateSpy = jest.spyOn(tokenGenerator, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });
  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepository } = makeSut();
    const updateAccessTokenRepositorySpy = jest.spyOn(
      updateAccessTokenRepository,
      "update"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateAccessTokenRepositorySpy).toHaveBeenCalledWith(
      makeFakeAccount().id,
      "any_token"
    );
  });
  test("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepository } = makeSut();
    jest
      .spyOn(updateAccessTokenRepository, "update")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
