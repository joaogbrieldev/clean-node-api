import { Encrypter } from "@/data/protocols/criptography/encrypter";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
}
