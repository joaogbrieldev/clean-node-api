import { SaveSurveyResultRepository } from "@/data/protocols/db/survey/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      { $set: data },
      { upsert: true, returnDocument: "after" }
    );
    return surveyResult.value ? MongoHelper.map(surveyResult.value) : null;
  }
}
