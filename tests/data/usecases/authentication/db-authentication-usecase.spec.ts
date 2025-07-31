import { LoadAccountByEmailRepository } from "@/data/protocols/load-account-by-email-repository";
import { DBAuthentication } from "@/data/usecases/authentication/db-authentication";
import { AuthenticationModel } from "@/domain/usecases/authentication";
import { AccountModel } from "../add-account/db-add-account-protocols";

describe("DBAuthenticationUsecase", () => {
  type SutTypes = {
    sut: DBAuthentication;
    loadAccountByEmailRepository: LoadAccountByEmailRepositorySpy;
  };

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
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositorySpy();
    const sut = new DBAuthentication(loadAccountByEmailRepository);
    return {
      sut,
      loadAccountByEmailRepository,
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
});
