import { spawnSync } from 'node:child_process';

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = encodeURIComponent(requireEnv('POSTGRES_USER'));
  const password = encodeURIComponent(requireEnv('POSTGRES_PASSWORD'));
  const database = encodeURIComponent(requireEnv('POSTGRES_DB'));

  return `postgresql://${user}:${password}@postgres:5432/${database}?schema=public`;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    env: {
      ...process.env,
      DATABASE_URL: buildDatabaseUrl(),
    },
    shell: true,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npm', ['--workspace', '@crm-saas/api', 'run', 'prisma:migrate:deploy']);
run('npm', ['--workspace', '@crm-saas/api', 'run', 'start:prod']);
