import { create } from 'zustand';
import { getPantryItems, addPantryItem, deletePantryItems } from '../api/pantryApi';
import type { IPantryItem, AddPantryItemDto } from '../types/pantry-types';

interface PantryState {
  items: IPantryItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (item: AddPantryItemDto) => Promise<boolean>;
  deleteItems: (itemIds: string[]) => Promise<boolean>;
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

  deleteItems: async (itemIds) => {
    try {
      set({ isLoading: true, error: null });

      // 1. Викликаємо API з масивом ID
      await deletePantryItems(itemIds);

      // 2. Оновлюємо стейт: фільтруємо, залишаючи лише ті,
      // що НЕ входять до списку 'itemIds'
      set((state) => ({
        items: state.items.filter((item) => !itemIds.includes(item.id)),
        isLoading: false,
      }));

      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Помилка при видаленні продуктів';
      set({ error: message, isLoading: false });
      return false;
    }
  },
}));
