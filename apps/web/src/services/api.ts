const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export function getApiUrl(path: string) {
  return new URL(path, API_URL).toString();
}

