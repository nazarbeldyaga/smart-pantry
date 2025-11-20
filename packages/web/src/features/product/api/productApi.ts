import { apiClient } from '@/shared/api/apiClient.ts';
import type { IProduct } from '@/shared/types/domain-types.ts';

export const getProductList = async (): Promise<IProduct[]> => {
  console.log('API: Запит getProductList...');
  try {
    const response = await apiClient.get<IProduct[]>('/products');
    return response.data;
  } catch (error) {
    console.error('Помилка завантаження довідника продуктів:', error);
    return [];
  }
};
