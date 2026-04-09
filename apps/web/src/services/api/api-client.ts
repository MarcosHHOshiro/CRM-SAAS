import { clearAuthSession, getAccessToken, getRefreshToken, persistAuthSession } from '@/features/auth/lib/auth-storage';
import type { AuthSession } from '@/features/auth/types/auth';
import { env } from '@/lib/env';

import { ApiError, parseApiErrorMessage } from './api-error';

type PrimitiveBody = string | Blob | FormData | URLSearchParams;

type ApiRequestBody = PrimitiveBody | Record<string, unknown> | null | undefined;

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  auth?: boolean;
  body?: ApiRequestBody;
  headers?: HeadersInit;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  retryOnAuthError?: boolean;
};

let refreshSessionPromise: Promise<AuthSession | null> | null = null;

function buildApiUrl(path: string) {
  return `${env.apiUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function isPrimitiveBody(body: ApiRequestBody): body is PrimitiveBody {
  return (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams
  );
}

function serializeBody(body: ApiRequestBody) {
  if (body === null || body === undefined) {
    return undefined;
  }

  if (isPrimitiveBody(body)) {
    return body;
  }

  return JSON.stringify(body);
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  if (contentType.includes('text/')) {
    return response.text();
  }

  return null;
}

async function refreshSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (!refreshSessionPromise) {
    refreshSessionPromise = (async () => {
      try {
        const session = await request<AuthSession>('/auth/refresh', {
          auth: false,
          body: { refreshToken },
          method: 'POST',
          retryOnAuthError: false,
        });

        persistAuthSession(session);

        return session;
      } catch {
        clearAuthSession();

        return null;
      } finally {
        refreshSessionPromise = null;
      }
    })();
  }

  return refreshSessionPromise;
}

async function request<T>(path: string, options: ApiRequestOptions = {}) {
  const {
    auth = false,
    body,
    headers,
    method = 'GET',
    retryOnAuthError = true,
    ...init
  } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set('accept', 'application/json');

  if (body && !isPrimitiveBody(body)) {
    requestHeaders.set('content-type', 'application/json');
  }

  if (auth) {
    const accessToken = getAccessToken();

    if (accessToken) {
      requestHeaders.set('authorization', `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    body: serializeBody(body),
    cache: 'no-store',
    headers: requestHeaders,
    method,
  });

  if (response.status === 401 && auth && retryOnAuthError) {
    const session = await refreshSession();

    if (session) {
      return request<T>(path, { ...options, retryOnAuthError: false });
    }

    clearAuthSession();
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      parseApiErrorMessage(data, response.statusText || 'Request failed.'),
      response.status,
      data,
    );
  }

  return data as T;
}

export const apiClient = {
  delete<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return request<T>(path, { ...options, method: 'GET' });
  },
  patch<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return request<T>(path, { ...options, method: 'PATCH' });
  },
  post<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return request<T>(path, { ...options, method: 'POST' });
  },
  put<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return request<T>(path, { ...options, method: 'PUT' });
  },
};
