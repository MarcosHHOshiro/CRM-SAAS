import { Transform } from 'class-transformer';
import { OpportunityStage, OpportunityStatus } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class ListOpportunitiesQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @IsOptional()
  @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @IsOptional()
  @IsIn(['createdAt', 'title', 'stage', 'status', 'expectedCloseDate', 'estimatedValue'])
  sortBy?: 'createdAt' | 'title' | 'stage' | 'status' | 'expectedCloseDate' | 'estimatedValue';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsIn(['stage'])
  groupBy?: 'stage';
}
