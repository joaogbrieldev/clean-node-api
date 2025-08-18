import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller";
import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../../login/log-controller-decorator.factory";
import { makeDbAddSurvey } from "../../usecases/add-survey/db-add-survey-factory";
import { makeAddSurveyValidation } from "./add-survey-validation";

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};
