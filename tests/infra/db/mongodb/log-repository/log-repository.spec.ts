import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { LogMongoRepository } from "@/infra/db/mongodb/log-repository/log";
import { Collection } from "mongodb";

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe("LogRepository", () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  test("should create an error log on success", async () => {
    const sut = makeSut();
    const log = {
      timestamp: new Date(),
      level: "info",
      message: "test",
    };

    await sut.log(log.message);

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
    expect(errorCollection.findOne({ message: log.message })).toBeTruthy();
  });
});
