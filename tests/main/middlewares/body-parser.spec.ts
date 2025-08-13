import app from "@/main/config/app";
import request from "supertest";

describe("BodyParser Middleware", () => {
  test("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.json(req.body);
    });

    await request(app)
      .post("/test_body_parser")
      .send({ name: "John Doe" })
      .expect(200)
      .expect({ name: "John Doe" });
  });
});
