import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import app from "@/main/config/app";
import { hash } from "bcrypt";
import { Collection } from "mongodb";
import request from "supertest";

let accountCollection: Collection;

describe("SignUp Routes", () => {
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

  describe("POST /login", () => {
    test("should return 200 on success", async () => {
      const password = await hash("123456", 12);
      await accountCollection.insertOne({
        name: "John Doe",
        email: "john.doe@example.com",
        password,
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "john.doe@example.com",
          password: "123456",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeTruthy();
        });
    });
    test("should return 401 on invalid credentials", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "john.doe@example.com",
          password: "123456",
        })
        .expect(401);
    });
  });
});
