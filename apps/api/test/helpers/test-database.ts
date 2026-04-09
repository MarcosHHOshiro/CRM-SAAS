import { PrismaClient } from '@prisma/client';

import { applyTestEnvironment } from '../../scripts/test-env.mjs';

applyTestEnvironment();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function resetDatabase() {
  const tables = await prisma.$queryRawUnsafe<Array<{ qualifiedName: string }>>(
    `
      SELECT quote_ident(schemaname) || '.' || quote_ident(tablename) AS "qualifiedName"
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT LIKE '\\_prisma%' ESCAPE '\\'
    `,
  );

  if (tables.length === 0) {
    return;
  }

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((table) => table.qualifiedName).join(', ')} RESTART IDENTITY CASCADE`,
  );
}
