import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import app from "@/main/config/app";
import { Collection } from "mongodb";
import request from "supertest";

let surveyCollection: Collection;

describe("Survey Routes", () => {
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

  describe("POST /surveys", () => {
    test("should return 200 on success", async () => {
      await surveyCollection.insertOne({
        question: "any_question",
        answers: [
          {
            answer: "any_answer",
            image: "any_image",
          },
        ],
      });
      await request(app)
        .post("/api/surveys")
        .send({
          question: "any_question",
          answers: [
            {
              answer: "any_answer",
              image: "any_image",
            },
          ],
        })
        .expect(204);
    });
  });
});
