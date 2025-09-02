import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { Collection } from "mongodb";

describe("Survey Result Mongo Repository", () => {
  let surveyCollection: Collection;
  let surveyResultCollection: Collection;
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    surveyResultCollection = await MongoHelper.getCollection("surveyResults");
    accountCollection = await MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
  });

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository();
  };

  const makeSurvey = async () => {
    const res = await surveyCollection.insertOne({
      question: "any_question",
      answers: [{ answer: "any_answer", image: "any_image" }],
      date: new Date(),
    });
    return res.insertedId.toString();
  };

  const makeAccount = async () => {
    const res = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    return res.insertedId.toString();
  };

  describe("Save", () => {
    test("Should add a survey result on success", async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: surveyId,
        accountId: accountId,
        answer: "any_answer",
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.surveyId).toBe(surveyId);
      expect(surveyResult.accountId).toBe(accountId);
      expect(surveyResult.answer).toBe("any_answer");
      expect(surveyResult.date).toBeInstanceOf(Date);
    });
  });
});
