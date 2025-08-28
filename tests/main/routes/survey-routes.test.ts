import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import app from "@/main/config/app";
import env from "@/main/config/env";
import jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";
let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    email: "any_email@mail.com",
    name: "any_name",
    password: "any_password",
    role: "admin",
  });
  const id = res.insertedId.toString();
  const accessToken = jwt.sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    { _id: res.insertedId },
    { $set: { accessToken } }
  );
  return accessToken;
};

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    accountCollection = await MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("should return 403 if no x-access-token is provided", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "any_question",
          answers: [{ answer: "any_answer" }],
        })
        .expect(403);
    });
    test("should return 204 on add survey with valid acessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "any_question",
          answers: [{ answer: "any_answer" }],
        })
        .expect(204);
    });
  });
  describe("GET /surveys", () => {
    test("should return 403 if no x-access-token is provided", async () => {
      await request(app).get("/api/surveys").expect(403);
    });
    test("should return 200 on load surveys with valid acessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(204);
    });
  });
});
