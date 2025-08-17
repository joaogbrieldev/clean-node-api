import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "@/data/usecases/add-survey/db-add-survey-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }
}
