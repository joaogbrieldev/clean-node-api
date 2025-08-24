import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/load-account-by-token-repository";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      );
      if (account) {
        return account;
      }
    }
  }
}
