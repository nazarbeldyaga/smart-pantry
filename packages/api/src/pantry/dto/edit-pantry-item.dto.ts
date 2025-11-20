import { IsString, IsNumber, IsIn, IsOptional, IsDateString } from 'class-validator';

export class EditPantryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsIn(['г', 'кг', 'мл', 'л', 'шт', 'уп'])
  unit?: 'г' | 'кг' | 'мл' | 'л' | 'шт' | 'уп';

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
