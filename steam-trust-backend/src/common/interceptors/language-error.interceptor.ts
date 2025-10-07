import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestWithLanguage } from '../middleware/language.middleware';
import { CustomException } from '../errors/custom-exception';
import { ErrorCode, ERROR_MESSAGES } from '../errors/error-codes';

@Injectable()
export class LanguageErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context
          .switchToHttp()
          .getRequest<RequestWithLanguage>();
        const language = request.language || 'en';

        // Если это наше кастомное исключение, переводим сообщение
        if (error instanceof CustomException) {
          const translatedError = new CustomException({
            code: error.code,
            statusCode: error.getStatus(),
            details: error.details,
            language,
          });
          return throwError(() => translatedError);
        }

        // Если это стандартное HTTP исключение, пытаемся перевести
        if (error instanceof HttpException) {
          const status = error.getStatus();
          let code: ErrorCode;
          let message: string;

          // Маппинг HTTP статусов на наши коды ошибок
          switch (status) {
            case HttpStatus.BAD_REQUEST:
              code = ErrorCode.VALIDATION_ERROR;
              break;
            case HttpStatus.UNAUTHORIZED:
              code = ErrorCode.UNAUTHORIZED;
              break;
            case HttpStatus.FORBIDDEN:
              code = ErrorCode.FORBIDDEN;
              break;
            case HttpStatus.NOT_FOUND:
              code = ErrorCode.NOT_FOUND;
              break;
            case HttpStatus.TOO_MANY_REQUESTS:
              code = ErrorCode.RATE_LIMIT_EXCEEDED;
              break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
              code = ErrorCode.INTERNAL_SERVER_ERROR;
              break;
            default:
              code = ErrorCode.INTERNAL_SERVER_ERROR;
          }

          message = ERROR_MESSAGES[code][language];

          const customError = new CustomException({
            code,
            statusCode: status,
            details: { originalError: error.message },
            language,
          });

          return throwError(() => customError);
        }

        // Для других ошибок создаем общую ошибку
        const generalError = new CustomException({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          details: { originalError: error.message },
          language,
        });

        return throwError(() => generalError);
      }),
    );
  }
}
