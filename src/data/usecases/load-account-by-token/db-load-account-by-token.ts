import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
