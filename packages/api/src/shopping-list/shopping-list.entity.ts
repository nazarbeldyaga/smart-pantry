export class ShoppingList {
  id: string;
  userId: string;
  productId: string | null;
  name: string;
  category: string;
  quantity: number;
  unit: 'г' | 'кг' | 'мл' | 'л' | 'шт' | 'уп';
}
