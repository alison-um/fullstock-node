export class AppError extends Error {
  constructor(message, statusCode, path = "/") {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
  }
}