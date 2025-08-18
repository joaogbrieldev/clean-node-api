import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";
import { Collection } from "mongodb";

describe("Account Mongo Repository", () => {
  let surveyCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
  };

  test("Should return an survey on add survey success", async () => {
    const sut = makeSut();
    await sut.add({
      question: "any_question",
      answers: [
        {
          answer: "any_answer",
          image: "any_image",
        },
      ],
    });
    const surveyInDb = await surveyCollection.findOne({
      question: "any_question",
    });
    expect(surveyInDb).toBeTruthy();
    expect(surveyInDb.question).toBe("any_question");
    expect(surveyInDb.answers).toEqual([
      {
        answer: "any_answer",
        image: "any_image",
      },
    ]);
  });
});
