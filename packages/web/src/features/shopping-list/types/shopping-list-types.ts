export interface IShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isChecked?: boolean;
}

export interface CreateShoppingItemDto {
  name: string;
  quantity: number;
  unit: string;
}
