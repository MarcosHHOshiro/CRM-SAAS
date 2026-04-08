type EnvironmentVariables = {
  NODE_ENV?: string;
  PORT?: string | number;
  CORS_ORIGIN?: string;
  DATABASE_URL?: string;
};

export function validateEnv(config: Record<string, unknown>) {
  const env = config as EnvironmentVariables;
  const port = Number(env.PORT ?? 3333);

  if (Number.isNaN(port)) {
    throw new Error('PORT must be a valid number.');
  }

  if (!env.DATABASE_URL || typeof env.DATABASE_URL !== 'string') {
    throw new Error('DATABASE_URL is required.');
  }

  return {
    NODE_ENV: env.NODE_ENV ?? 'development',
    PORT: port,
    CORS_ORIGIN:
      typeof env.CORS_ORIGIN === 'string' && env.CORS_ORIGIN.length > 0
        ? env.CORS_ORIGIN
        : 'http://localhost:3000',
    DATABASE_URL: env.DATABASE_URL,
  };
}

