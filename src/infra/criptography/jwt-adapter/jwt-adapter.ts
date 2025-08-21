import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }

  async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret);
  }
  async decrypt(value: string): Promise<string> {
    const token = await jwt.verify(value, this.secret);
    return token as string;
  }
}
