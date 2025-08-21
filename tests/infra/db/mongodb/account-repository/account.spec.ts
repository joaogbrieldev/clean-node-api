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
  describe("add", () => {
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
  });
  describe("loadByEmail", () => {
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

    describe("updateAccessToken", () => {
      test("should update the account accessToken on updateAccessToken success", async () => {
        const sut = makeSut();
        const res = await accountCollection.insertOne({
          email: "any_email@mail.com",
          name: "any_name",
          password: "any_password",
        });
        const account = await sut.loadByEmail("any_email@mail.com");
        await sut.updateAccessToken(account.id, "any_token");
        const updatedAccount = await accountCollection.findOne({
          _id: res.insertedId,
        });
        expect(updatedAccount.accessToken).toBe("any_token");
      });
    });
  });
});
