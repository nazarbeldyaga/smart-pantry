import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CompleteShoppingDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];
}
