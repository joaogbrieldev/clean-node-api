import { makeSignUpController } from "@/main/factories/signup";
import { Router } from "express";
import { adaptRoute } from "./adapter/express-route-adapter";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
};
