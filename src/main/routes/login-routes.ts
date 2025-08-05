import { makeLoginController } from "@/main/factories/login/login-factory";
import { makeSignUpController } from "@/main/factories/signup";
import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
