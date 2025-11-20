import { IsNotEmpty, IsString, IsNumber, Min, IsIn, IsOptional } from 'class-validator';
import type { UnitType } from '../../shared/domain-types';
import { UNIT_TYPES } from '../../shared/domain-types';

export class CreateShoppingItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0.1)
  quantity: number;

  @IsIn(UNIT_TYPES)
  unit: UnitType;

  @IsOptional()
  @IsString()
  category?: string;
}
