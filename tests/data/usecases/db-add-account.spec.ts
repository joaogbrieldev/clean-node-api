import { DbAddAccount } from "@/data/usecases/add-account/db-add-account";
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "@/data/usecases/add-account/db-add-account-protocols";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(null));
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HasherStub();
};

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const accountData = makeFakeAccount();
    await sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledWith(accountData.password);
  });

  test("Should throw if Encrypter throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccount();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccount();
    await sut.add(accountData);
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });

  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccount();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccount();
    const account = await sut.add(accountData);
    expect(account).toEqual(makeFakeAccount());
  });

  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadAccountByEmailRepositorySpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      "loadByEmail"
    );
    await sut.add(makeFakeAccount());
    expect(loadAccountByEmailRepositorySpy).toHaveBeenCalledWith(
      makeFakeAccount().email
    );
  });
  test("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeAccount()))
      );
    const account = await sut.add(makeFakeAccount());
    expect(account).toBeNull();
  });
});
