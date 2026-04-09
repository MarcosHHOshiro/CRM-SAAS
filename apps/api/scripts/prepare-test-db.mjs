import { execSync } from 'node:child_process';

import pg from 'pg';

import {
  apiDirectory,
  applyTestEnvironment,
  getAdminDatabaseUrl,
  getDatabaseName,
} from './test-env.mjs';

const { Client } = pg;

function escapeIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

async function ensureTestDatabaseExists() {
  const { applicationDatabaseUrl, testDatabaseUrl } = applyTestEnvironment();

  if (applicationDatabaseUrl === testDatabaseUrl) {
    throw new Error('Refusing to prepare tests with the primary DATABASE_URL.');
  }

  const client = new Client({
    connectionString: getAdminDatabaseUrl(testDatabaseUrl),
  });

  await client.connect();

  try {
    const databaseName = getDatabaseName(testDatabaseUrl);
    const existingDatabase = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (existingDatabase.rowCount === 0) {
      await client.query(`CREATE DATABASE ${escapeIdentifier(databaseName)}`);
    }
  } finally {
    await client.end();
  }

  execSync(
    'npx prisma db push --accept-data-loss --skip-generate --schema ./prisma/schema.prisma',
    {
      cwd: apiDirectory,
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      stdio: 'inherit',
    },
  );
}

await ensureTestDatabaseExists();
