import { InvalidParamError } from "@/presentation/errors";
import { Validation } from "@/validation/protocols/validation";

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate(input: any): Error {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare);
    }
  }
}
