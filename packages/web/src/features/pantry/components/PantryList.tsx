import React, { useEffect, useState, useMemo } from 'react';
import { usePantryStore } from '../state/usePantryStore';
import { PantryCard } from './PantryCard';
import type { IPantryItem } from '../types/pantry-types';
import styles from './PantryList.module.css';

type SortKey = 'name' | 'quantity' | 'expiryDate';
type SortOrder = 'asc' | 'desc';

export const PantryList: React.FC = () => {
  const items = usePantryStore((state) => state.items);
  const isLoading = usePantryStore((state) => state.isLoading);
  const error = usePantryStore((state) => state.error);
  const fetchItems = usePantryStore((state) => state.fetchItems);

  const [searchQuery, setSearchQuery] = useState('');

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const processedItems = useMemo(() => {
    const result = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Сортування
    result.sort((a: IPantryItem, b: IPantryItem) => {
      let compareResult = 0;

      if (sortKey === 'quantity') {
        compareResult = a.quantity - b.quantity;
      } else if (sortKey === 'name') {
        compareResult = a.name.localeCompare(b.name);
      } else if (sortKey === 'expiryDate') {
        const aDate = a.expiryDate;
        const bDate = b.expiryDate;
        // Продукти без дати - в кінець
        if (aDate && bDate) {
          compareResult = aDate.localeCompare(bDate);
        } else if (aDate) {
          compareResult = -1;
        } else if (bDate) {
          compareResult = 1;
        }
      }

      return sortOrder === 'asc' ? compareResult : -compareResult;
    });

    return result;
  }, [items, searchQuery, sortKey, sortOrder]);

  const handleSortSelect = (key: SortKey, order: SortOrder) => {
    setSortKey(key);
    setSortOrder(order);
    setIsSortMenuOpen(false);
  };

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: 20 }}>Завантаження...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Помилка: {error}</p>;

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Пошук продуктів..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.sortContainer}>
          <button
            className={`${styles.sortButton} ${isSortMenuOpen ? styles.active : ''}`}
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            title="Сортування"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="14" y1="12" y2="12" />
              <line x1="4" x2="10" y1="18" y2="18" />
              <line x1="4" x2="20" y1="6" y2="6" />
            </svg>
          </button>

          {isSortMenuOpen && (
            <div className={styles.sortMenu}>
              <div
                className={`${styles.sortOption} ${sortKey === 'name' && sortOrder === 'asc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('name', 'asc')}
              >
                Назва (А-Я) {sortKey === 'name' && sortOrder === 'asc' && '✓'}
              </div>
              <div
                className={`${styles.sortOption} ${sortKey === 'name' && sortOrder === 'desc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('name', 'desc')}
              >
                Назва (Я-А) {sortKey === 'name' && sortOrder === 'desc' && '✓'}
              </div>
              <div
                className={`${styles.sortOption} ${sortKey === 'quantity' && sortOrder === 'desc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('quantity', 'desc')}
              >
                Кількість (Найбільша) {sortKey === 'quantity' && sortOrder === 'desc' && '✓'}
              </div>
              <div
                className={`${styles.sortOption} ${sortKey === 'quantity' && sortOrder === 'asc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('quantity', 'asc')}
              >
                Кількість (Найменша) {sortKey === 'quantity' && sortOrder === 'asc' && '✓'}
              </div>
              <div
                className={`${styles.sortOption} ${sortKey === 'expiryDate' && sortOrder === 'asc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('expiryDate', 'asc')}
              >
                Термін (Скоро спливає) {sortKey === 'expiryDate' && sortOrder === 'asc' && '✓'}
              </div>
              <div
                className={`${styles.sortOption} ${sortKey === 'expiryDate' && sortOrder === 'desc' ? styles.selected : ''}`}
                onClick={() => handleSortSelect('expiryDate', 'desc')}
              >
                Термін (Найсвіжіші) {sortKey === 'expiryDate' && sortOrder === 'desc' && '✓'}
              </div>
            </div>
          )}
        </div>
      </div>
      {processedItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Нічого не знайдено</p>
      ) : (
        <div className={styles.grid}>
          {processedItems.map((item) => (
            <PantryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
