import { create } from 'zustand';
import { getPantryItems, addPantryItem } from '../api/pantryApi';
import type { IPantryItem, AddPantryItemDto } from '../types/pantry-types';

interface PantryState {
  items: IPantryItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (item: AddPantryItemDto) => Promise<boolean>;
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
    } catch (err) {
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
    } catch (err: any) {
      const message = err.response?.data?.message || 'Невідома помилка сервера';
      set({ error: message, isLoading: false });
      return false;
    }
  },
}));
