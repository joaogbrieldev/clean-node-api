import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

describe("Account Mongo Repository", () => {
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test("Should return an account on add account success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return an account on loadByEmail success", async () => {
    const sut = makeSut();
    await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
  });

  test("Should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeNull();
  });
});
