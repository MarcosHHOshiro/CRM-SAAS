import { ActivityType } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListActivitiesQueryDto {
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @IsOptional()
  @IsUUID()
  authorUserId?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;
}
