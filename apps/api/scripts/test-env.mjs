import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));

export const apiDirectory = resolve(scriptsDirectory, '..');

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@127.0.0.1:15432/crm_saas?schema=public';

function parseEnvFile(content) {
  const entries = {};

  for (const line of content.split(/\r?\n/u)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/gu, '');

    if (key.length > 0) {
      entries[key] = value;
    }
  }

  return entries;
}

function loadEnvFiles() {
  for (const filePath of [resolve(apiDirectory, '.env.local'), resolve(apiDirectory, '.env')]) {
    if (!existsSync(filePath)) {
      continue;
    }

    const entries = parseEnvFile(readFileSync(filePath, 'utf8'));

    for (const [key, value] of Object.entries(entries)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

export function deriveTestDatabaseUrl(databaseUrl) {
  const parsedUrl = new URL(databaseUrl);
  const databaseName = parsedUrl.pathname.replace(/^\//u, '');

  parsedUrl.pathname =
    databaseName.length > 0 && databaseName !== 'postgres'
      ? `/${databaseName.endsWith('_test') ? databaseName : `${databaseName}_test`}`
      : '/crm_saas_test';

  return parsedUrl.toString();
}

export function getDatabaseName(databaseUrl) {
  return new URL(databaseUrl).pathname.replace(/^\//u, '');
}

export function getAdminDatabaseUrl(databaseUrl) {
  const parsedUrl = new URL(databaseUrl);

  parsedUrl.pathname = '/postgres';

  return parsedUrl.toString();
}

export function applyTestEnvironment() {
  loadEnvFiles();

  const applicationDatabaseUrl =
    process.env.APPLICATION_DATABASE_URL ??
    process.env.DATABASE_URL ??
    DEFAULT_DATABASE_URL;
  const explicitTestDatabaseUrl = process.env.TEST_DATABASE_URL;
  const testDatabaseUrl = explicitTestDatabaseUrl ?? deriveTestDatabaseUrl(applicationDatabaseUrl);

  if (explicitTestDatabaseUrl && explicitTestDatabaseUrl === applicationDatabaseUrl) {
    throw new Error('TEST_DATABASE_URL must be different from DATABASE_URL.');
  }

  process.env.NODE_ENV ??= 'test';
  process.env.PORT ??= '3335';
  process.env.CORS_ORIGIN ??= 'http://localhost:3000';
  process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
  process.env.JWT_ACCESS_EXPIRES_IN ??= '15m';
  process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';
  process.env.JWT_REFRESH_EXPIRES_IN ??= '7d';
  process.env.BCRYPT_SALT_ROUNDS ??= '10';
  process.env.APPLICATION_DATABASE_URL = applicationDatabaseUrl;
  process.env.TEST_DATABASE_URL = testDatabaseUrl;
  process.env.DATABASE_URL = testDatabaseUrl;

  return {
    applicationDatabaseUrl,
    testDatabaseUrl,
  };
}
