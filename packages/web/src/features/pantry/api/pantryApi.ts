import { apiClient } from '../../../shared/api/apiClient';
import type { IPantryItem, AddPantryItemDto } from '../types/pantry-types';

export const getPantryItems = async (): Promise<IPantryItem[]> => {
  console.log('API: Запит getPantryItems...');
  try {
    const response = await apiClient.get<IPantryItem[]>('/pantry');
    return response.data;
  } catch (error) {
    console.error('Помилка завантаження комори:', error);
    return [];
  }
};

export const addPantryItem = async (item: AddPantryItemDto): Promise<IPantryItem> => {
  console.log('API: Запит addPantryItem з:', item);
  const response = await apiClient.post<IPantryItem>('/pantry', item);
  return response.data;
};
