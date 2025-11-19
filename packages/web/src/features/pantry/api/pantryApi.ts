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

export const deletePantryItems = async (itemIds: string[]): Promise<void> => {
  console.log('API: Запит deletePantryItems з IDs:', itemIds);
  try {
    await apiClient.delete('/pantry', {
      data: { ids: itemIds },
    });
  } catch (error) {
    console.error('Помилка видалення продуктів:', error);
    throw error;
  }
};

export const updatePantryItem = async (
  id: string,
  updates: AddPantryItemDto
): Promise<IPantryItem> => {
  console.log(`API: Запит updatePantryItem для ID: ${id}`, updates);
  try {
    const response = await apiClient.patch<IPantryItem>(`/pantry/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Помилка оновлення продукту ID ${id}:`, error);
    throw error;
  }
};
