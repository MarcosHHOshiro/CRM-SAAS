import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env.validation';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { HealthModule } from './modules/health/health.module';
import { LeadsModule } from './modules/leads/leads.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../../.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    ActivitiesModule,
    AuthModule,
    ClientsModule,
    HealthModule,
    LeadsModule,
    OpportunitiesModule,
    OrganizationsModule,
    UsersModule,
  ],
})
export class AppModule {}
