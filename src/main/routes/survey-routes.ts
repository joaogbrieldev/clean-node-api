import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddSurveyController } from "../factories/controllers/add-survey/add-survey-controller-factory";
import { makeLoadSurveysController } from "../factories/controllers/load-surveys/load-surveys-controller-factory";
import { adminAuth } from "../middlewares/admin-auth";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeLoadSurveysController()));
};
