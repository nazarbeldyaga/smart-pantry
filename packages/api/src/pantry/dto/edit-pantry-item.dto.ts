import { IsString, IsNumber, IsIn, IsOptional, IsDateString } from 'class-validator';
import type { UnitType } from '../../shared/domain-types';
import { UNIT_TYPES } from '../../shared/domain-types';

export class EditPantryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsIn(UNIT_TYPES)
  unit?: UnitType;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
