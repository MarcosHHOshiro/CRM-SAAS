import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'estimatedValue must be a valid decimal with up to 2 decimal places.',
  })
  estimatedValue?: string;

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string | null;

  @IsOptional()
  @IsUUID()
  ownerUserId?: string | null;
}
