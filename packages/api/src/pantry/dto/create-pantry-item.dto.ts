import { IsString, IsNumber, IsIn, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreatePantryItemDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  quantity: number;

  @IsIn(['г', 'кг', 'мл', 'л', 'шт', 'уп'])
  unit: 'г' | 'кг' | 'мл' | 'л' | 'шт' | 'уп';

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
