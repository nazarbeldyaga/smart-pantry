import { IsNotEmpty, IsString, IsNumber, Min, IsIn, IsOptional } from 'class-validator';

export class CreateShoppingItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0.1)
  quantity: number;

  @IsIn(['г', 'кг', 'мл', 'л', 'шт', 'уп'])
  unit: 'г' | 'кг' | 'мл' | 'л' | 'шт' | 'уп';

  @IsOptional()
  @IsString()
  category?: string;
}
