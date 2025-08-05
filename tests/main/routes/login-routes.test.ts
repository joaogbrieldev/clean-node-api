import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import app from "@/main/config/app";
import request from "supertest";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /signup", () => {
    test("should return an account on success", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "John Doe",
          email: "john.doe@example.com",
          password: "123456",
          passwordConfirmation: "123456",
        })
        .expect(200);
    });
  });
});
