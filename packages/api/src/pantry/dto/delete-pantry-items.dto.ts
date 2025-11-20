import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class DeletePantryItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
