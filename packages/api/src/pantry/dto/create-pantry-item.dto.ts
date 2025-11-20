import { IsString, IsNumber, IsIn, IsOptional, IsDateString, MinLength } from 'class-validator';
import type { UnitType } from '../../shared/domain-types';
import { UNIT_TYPES } from '../../shared/domain-types';

export class CreatePantryItemDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  quantity: number;

  @IsIn(UNIT_TYPES)
  unit: UnitType;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
