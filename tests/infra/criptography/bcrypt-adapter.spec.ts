import { BcryptAdapter } from "@/infra/criptography/bcrypt-adapter/bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(value: string, salt: number): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(value: string, hash: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
  test("Should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });
  test("Should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });
  test("should call compare with correct values", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });
  test("should return true when compare succeeds", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });
  test("should return false when compare fails", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });
    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).resolves.toBe(false);
  });
  test("should throw if bcrypt compare throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });
});
