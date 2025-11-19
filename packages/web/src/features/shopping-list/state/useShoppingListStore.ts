import { create } from 'zustand';
import type { IShoppingItem, CreateShoppingItemDto } from '../types/shopping-list-types';
import * as api from '../api/shoppingListApi';

interface ShoppingListState {
  items: IShoppingItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (dto: CreateShoppingItemDto) => Promise<boolean>;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => Promise<void>;
  completeShopping: () => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getShoppingList();
      const itemsWithState = res.data.map((item) => ({ ...item, isChecked: false }));
      set({ items: itemsWithState, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addItem: async (dto) => {
    try {
      const res = await api.addShoppingItem(dto);
      const newItem = { ...res.data, isChecked: false };
      set((state) => ({ items: [...state.items, newItem] }));
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  },

  toggleItem: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      ),
    }));
  },

  deleteItem: async (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    try {
      await api.deleteShoppingItem(id);
    } catch (err) {
      console.error(err);
    }
  },

  completeShopping: async () => {
    const { items } = get();

    const selectedIds = items.filter((i) => i.isChecked).map((i) => i.id);

    if (selectedIds.length === 0) return;

    set({ isLoading: true });
    try {
      await api.completeShopping(selectedIds);

      await get().fetchItems();

      alert('Продукти успішно переміщені в комору!');
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
