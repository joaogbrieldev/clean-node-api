import { MongoHelper as sut } from "@/infra/db/mongodb/helpers/mongo-helper";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it("should reconnect when it is disconnected", async () => {
    const accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    const accountCollection2 = await sut.getCollection("accounts");
    expect(accountCollection2).toBeTruthy();
  });
});
