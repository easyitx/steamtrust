import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ValidationError,
} from '@nestjs/common';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { CustomException } from '../errors/custom-exception';

export enum ValidateRequestSource {
  body = 'body',
  params = 'params',
  query = 'query',
}

type ValidationOptions = {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  forbidUnknownValues?: boolean;
};

@Injectable()
class ValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly dto: ClassType<object>,
    private readonly source: ValidateRequestSource = ValidateRequestSource.body,
    private readonly validationOptions?: ValidationOptions,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const options = this.validationOptions || {};
    const req = context.switchToHttp().getRequest();
    const data = typeof req[this.source] === 'object' ? req[this.source] : {};

    try {
      const validatedData = await transformAndValidate(this.dto, data, {
        validator: {
          stopAtFirstError: false,
          whitelist: options.whitelist ?? true,
          forbidNonWhitelisted: options.forbidNonWhitelisted ?? false,
          forbidUnknownValues: options.forbidUnknownValues ?? false,
        },
      });

      // Для query параметров используем Object.defineProperty чтобы избежать ошибки readonly
      if (this.source === ValidateRequestSource.query) {
        Object.defineProperty(req, 'query', {
          value: validatedData,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        req[this.source] = validatedData;
      }
    } catch (err) {
      if (Array.isArray(err)) {
        const validationErrors = this.formatValidationErrors(
          err as ValidationError[],
        );
        throw CustomException.validationError(validationErrors);
      } else {
        throw CustomException.validationError({
          message: err.message,
          type: 'validation_error',
        });
      }
    }

    return next.handle();
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): Record<string, any> {
    const formattedErrors: Record<string, any> = {
      validationErrors: [],
      message: 'Validation failed',
    };

    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          formattedErrors.validationErrors.push({
            field: error.property,
            message: constraint,
            value: error.value,
            constraints: error.constraints,
          });
        });
      }

      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        formattedErrors.validationErrors.push(...nestedErrors.validationErrors);
      }
    });

    return formattedErrors;
  }
}

@Injectable()
export class BodyValidationInterceptor extends ValidationInterceptor {
  constructor(dto: ClassType<object>, validationOptions?: ValidationOptions) {
    super(dto, ValidateRequestSource.body, validationOptions);
  }
}

@Injectable()
export class ParamsValidationInterceptor extends ValidationInterceptor {
  constructor(dto: ClassType<object>) {
    super(dto, ValidateRequestSource.params);
  }
}

@Injectable()
export class QueryValidationInterceptor extends ValidationInterceptor {
  constructor(dto: ClassType<object>) {
    super(dto, ValidateRequestSource.query);
  }
}
