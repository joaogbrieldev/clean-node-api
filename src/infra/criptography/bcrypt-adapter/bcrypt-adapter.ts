import { Hasher } from "@/data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
