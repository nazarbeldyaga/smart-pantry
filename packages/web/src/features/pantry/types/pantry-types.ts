import type { UnitType } from '../../../shared/types/domain-types';

export interface IPantryItem {
  id: string;
  productId: string | null;
  name: string;
  quantity: number;
  unit: UnitType;
  expiryDate?: string;
  category: string;
  userId: string;
}

export type AddPantryItemDto = {
  name: string;
  quantity: number;
  unit: UnitType;
  expiryDate?: string;
  category?: string;
};
