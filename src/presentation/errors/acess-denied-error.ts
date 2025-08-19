export class AcessDeniedError extends Error {
  constructor() {
    super("Access denied");
    this.name = "AcessDeniedError";
  }
}
