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
    // Axios дозволяє надсилати тіло (data) у DELETE-запиті.
    // На бекенді (NestJS) ви будете ловити це тіло через @Body().
    await apiClient.delete('/pantry', {
      data: { ids: itemIds },
    });
    // Успішне видалення зазвичай не повертає вміст (статус 204)
  } catch (error) {
    console.error('Помилка видалення продуктів:', error);
    // Також перекидаємо помилку, щоб стейт-менеджер її обробив
    throw error;
  }
};
