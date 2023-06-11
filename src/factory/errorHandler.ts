import { HttpException } from '@nestjs/common';

export class ErrorHandler {
  static createError(message: string, statusCode: number) {
    throw new HttpException(message, statusCode);
  }
}
