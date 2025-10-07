import { HttpException } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request', errorCode?: string) {
    super(
      {
        errorMessage: message,
        errorCode: errorCode ? errorCode : 'badRequest',
      },
      400,
    );
  }
}
