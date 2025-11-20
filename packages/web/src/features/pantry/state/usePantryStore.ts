import { create } from 'zustand';
import {
  getPantryItems,
  addPantryItem,
  deletePantryItems,
  updatePantryItem,
} from '../api/pantryApi';
import type { IPantryItem, AddPantryItemDto } from '../types/pantry-types';
import { AxiosError } from 'axios';

interface PantryState {
  items: IPantryItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (item: AddPantryItemDto) => Promise<boolean>;
  deleteItems: (itemIds: string[]) => Promise<boolean>;

  updateItem: (id: string, updates: AddPantryItemDto) => Promise<boolean>;
}

export const usePantryStore = create<PantryState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedItems = await getPantryItems();
      set({ items: fetchedItems, isLoading: false });
    } catch (_) {
      set({ error: 'Помилка завантаження даних', isLoading: false });
    }
  },

  addItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      const newItem = await addPantryItem(item);
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }));
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || 'Невідома помилка сервера';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteItems: async (itemIds) => {
    try {
      set({ isLoading: true, error: null });

      await deletePantryItems(itemIds);

      set((state) => ({
        items: state.items.filter((item) => !itemIds.includes(item.id)),
        isLoading: false,
      }));

      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || 'Помилка при видаленні продуктів';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateItem: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });

      const updatedItemFromApi = await updatePantryItem(id, updates);

      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItemFromApi : item)),
        isLoading: false,
      }));
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || 'Помилка при оновленні продукту';
      set({ error: message, isLoading: false });
      return false;
    }
  },
}));
