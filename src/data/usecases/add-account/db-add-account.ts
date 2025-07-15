import { Encrypter } from "@/data/protocols/encrypter";
import { AccountModel } from "@/domain/models/account";
import { AddAccount, AddAccountModel } from "@/domain/usecases/add-account";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password);
    return null;
  }
}
