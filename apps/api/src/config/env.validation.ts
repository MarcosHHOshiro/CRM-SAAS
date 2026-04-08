type EnvironmentVariables = {
  NODE_ENV?: string;
  PORT?: string | number;
  CORS_ORIGIN?: string;
  DATABASE_URL?: string;
  JWT_ACCESS_SECRET?: string;
  JWT_ACCESS_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
  BCRYPT_SALT_ROUNDS?: string | number;
};

export function validateEnv(config: Record<string, unknown>) {
  const env = config as EnvironmentVariables;
  const port = Number(env.PORT ?? 3333);
  const bcryptSaltRounds = Number(env.BCRYPT_SALT_ROUNDS ?? 10);

  if (Number.isNaN(port)) {
    throw new Error('PORT must be a valid number.');
  }

  if (Number.isNaN(bcryptSaltRounds) || bcryptSaltRounds < 8) {
    throw new Error('BCRYPT_SALT_ROUNDS must be a number greater than or equal to 8.');
  }

  if (!env.DATABASE_URL || typeof env.DATABASE_URL !== 'string') {
    throw new Error('DATABASE_URL is required.');
  }

  if (!env.JWT_ACCESS_SECRET || typeof env.JWT_ACCESS_SECRET !== 'string') {
    throw new Error('JWT_ACCESS_SECRET is required.');
  }

  if (!env.JWT_ACCESS_EXPIRES_IN || typeof env.JWT_ACCESS_EXPIRES_IN !== 'string') {
    throw new Error('JWT_ACCESS_EXPIRES_IN is required.');
  }

  if (!env.JWT_REFRESH_SECRET || typeof env.JWT_REFRESH_SECRET !== 'string') {
    throw new Error('JWT_REFRESH_SECRET is required.');
  }

  if (!env.JWT_REFRESH_EXPIRES_IN || typeof env.JWT_REFRESH_EXPIRES_IN !== 'string') {
    throw new Error('JWT_REFRESH_EXPIRES_IN is required.');
  }

  return {
    NODE_ENV: env.NODE_ENV ?? 'development',
    PORT: port,
    CORS_ORIGIN:
      typeof env.CORS_ORIGIN === 'string' && env.CORS_ORIGIN.length > 0
        ? env.CORS_ORIGIN
        : 'http://localhost:3000',
    DATABASE_URL: env.DATABASE_URL,
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN,
    BCRYPT_SALT_ROUNDS: bcryptSaltRounds,
  };
}
