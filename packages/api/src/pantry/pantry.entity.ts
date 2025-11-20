export class PantryItem {
  id: string;
  userId: string;
  productId: string | null;
  name: string;
  category: string;
  quantity: number;
  unit: 'г' | 'кг' | 'мл' | 'л' | 'шт' | 'уп';
  expiryDate?: string;
}
