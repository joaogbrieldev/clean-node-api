import { LoadAccountByEmailRepository } from "@/data/protocols/load-account-by-email-repository";
import { DBAuthentication } from "@/data/usecases/authentication/db-authentication";
import { AccountModel } from "../add-account/db-add-account-protocols";

describe("DBAuthenticationUsecase", () => {
  test("should return an authentication model", async () => {
    class LoadAccountByEmailRepositorySpy
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: "any_id",
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
        };
        return new Promise((resolve) => resolve(account));
      }
    }
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositorySpy();
    const sut = new DBAuthentication(loadAccountByEmailRepository);
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, "load");
    await sut.auth({
      email: "",
      password: "",
    });
    expect(loadSpy).toHaveBeenCalledWith("");
  });
});
