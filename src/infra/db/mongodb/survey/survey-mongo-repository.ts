import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { AddSurveyModel } from "@/data/usecases/add-survey/db-add-survey-protocols";
import { SurveyModel } from "@/domain/models/survey";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = await surveyCollection.find().toArray();
    return surveys.map(MongoHelper.map);
  }
  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return survey ? MongoHelper.map(survey) : null;
  }
}
