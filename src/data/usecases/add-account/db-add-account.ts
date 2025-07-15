import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password);
    return null;
  }
}
