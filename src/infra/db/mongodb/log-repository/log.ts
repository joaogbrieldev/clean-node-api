import { LogErrorRepository } from "@/data/protocols/db/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogMongoRepository implements LogErrorRepository {
  async log(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
