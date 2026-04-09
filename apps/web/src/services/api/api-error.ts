export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function parseApiErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'string' && data.length > 0) {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    return fallback;
  }

  if ('message' in data) {
    const message = data.message;

    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return message.filter((item): item is string => typeof item === 'string').join(' ');
    }
  }

  return fallback;
}
