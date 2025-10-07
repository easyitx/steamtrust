import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithLanguage extends Request {
  language: 'en' | 'ru';
}

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: RequestWithLanguage, res: Response, next: NextFunction) {
    // Определяем язык из заголовков или query параметров
    const acceptLanguage = req.headers['accept-language'] || '';
    const queryLanguage = req.query.lang as string;

    let language: 'en' | 'ru' = 'en'; // по умолчанию английский

    if (queryLanguage && (queryLanguage === 'en' || queryLanguage === 'ru')) {
      language = queryLanguage;
    } else if (acceptLanguage.includes('ru')) {
      language = 'ru';
    } else if (acceptLanguage.includes('en')) {
      language = 'en';
    }

    req.language = language;
    next();
  }
}
