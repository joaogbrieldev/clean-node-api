export class ServerError extends Error {
  constructor(stack: string) {
    super("Internal server error");
    this.stack = stack;
    this.name = "ServerError";
  }
}
