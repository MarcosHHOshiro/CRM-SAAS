import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

type NormalizedErrorResponse = {
  code: string;
  details?: unknown;
  message: string;
  statusCode: number;
};

const statusCodeLabels: Partial<Record<HttpStatus, string>> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

function getStatusCodeLabel(statusCode: number) {
  return statusCodeLabels[statusCode as HttpStatus] ?? 'HTTP_ERROR';
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<{ url?: string }>();
    const response = context.getResponse<{
      json: (body: Record<string, unknown>) => void;
      status: (statusCode: number) => { json: (body: Record<string, unknown>) => void };
    }>();

    const normalized = this.normalizeException(exception);

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.message : 'Unexpected exception',
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(normalized.statusCode).json({
      code: normalized.code,
      ...(normalized.details !== undefined ? { details: normalized.details } : {}),
      message: normalized.message,
      path: request.url ?? '',
      statusCode: normalized.statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  private normalizeException(exception: unknown): NormalizedErrorResponse {
    if (!(exception instanceof HttpException)) {
      return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        code: getStatusCodeLabel(statusCode),
        message: exceptionResponse,
        statusCode,
      };
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseRecord = exceptionResponse as Record<string, unknown>;
      const rawMessage = responseRecord.message;
      const message =
        typeof rawMessage === 'string'
          ? rawMessage
          : Array.isArray(rawMessage)
            ? rawMessage.filter((item): item is string => typeof item === 'string').join(' ')
            : exception.message;

      const rawError = responseRecord.error;
      const code =
        typeof rawError === 'string'
          ? rawError.toUpperCase().replace(/\s+/g, '_')
          : getStatusCodeLabel(statusCode);

      return {
        code,
        ...(Array.isArray(rawMessage) ? { details: rawMessage } : {}),
        message,
        statusCode,
      };
    }

    return {
      code: getStatusCodeLabel(statusCode),
      message: exception.message,
      statusCode,
    };
  }
}
