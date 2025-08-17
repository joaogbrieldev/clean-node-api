import loginRoutes from "@/main/routes/login-routes";
import surveyRoutes from "@/main/routes/survey-routes";
import { Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  loginRoutes(router);
  surveyRoutes(router);
};
