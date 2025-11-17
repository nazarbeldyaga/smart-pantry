import { apiClient } from '../../../shared/api/apiClient';
import type { IProduct } from '../../../shared/types/domain-types';

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
