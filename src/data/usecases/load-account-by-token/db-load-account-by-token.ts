import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (!token) {
      return null;
    }
  }
}
