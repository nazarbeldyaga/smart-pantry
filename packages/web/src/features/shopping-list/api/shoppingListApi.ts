import { apiClient } from '@/shared/api/apiClient.ts';
import type { IShoppingItem, CreateShoppingItemDto } from '../types/shopping-list-types';

export const getShoppingList = () => apiClient.get<IShoppingItem[]>('/shopping-list');

export const addShoppingItem = (dto: CreateShoppingItemDto) =>
  apiClient.post<IShoppingItem>('/shopping-list', dto);

export const deleteShoppingItem = (id: string) => apiClient.delete(`/shopping-list/${id}`);

export const completeShopping = (ids: string[]) =>
  apiClient.post<{ count: number }>('/shopping-list/complete', { ids });
