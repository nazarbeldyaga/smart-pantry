import React, { useEffect, useState, useMemo } from 'react';
import { usePantryStore } from '../state/usePantryStore';
import type { IPantryItem } from '../types/pantry-types';
import styles from './PantryList.module.css';

type SortKey = 'name' | 'quantity' | 'category' | 'expiryDate';
type SortOrder = 'asc' | 'desc';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('uk-UA');
  } catch (e) {
    return 'Невірна дата';
  }
};

const getExpiryInfo = (dateString?: string): { text: string; colorClass: string } => {
  if (!dateString) {
    return { text: '', colorClass: '' };
  }

  const today = new Date();
  const expiryDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `(прострочено ${-diffDays} дн.)`,
      colorClass: styles.expired,
    };
  }
  if (diffDays === 0) {
    return {
      text: '(останній день)',
      colorClass: styles.warn,
    };
  }
  if (diffDays <= 5) {
    return {
      text: `(залишилось ${diffDays} дн.)`,
      colorClass: styles.warn,
    };
  }
  return {
    text: `(залишилось ${diffDays} дн.)`,
    colorClass: styles.safe,
  };
};

export const PantryList: React.FC = () => {
  const items = usePantryStore((state) => state.items);
  const isLoading = usePantryStore((state) => state.isLoading);
  const error = usePantryStore((state) => state.error);
  const fetchItems = usePantryStore((state) => state.fetchItems);

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: IPantryItem, b: IPantryItem) => {
      let result = 0;

      if (sortKey === 'quantity') {
        const aValue = a.quantity;
        const bValue = b.quantity;
        result = aValue - bValue;
      } else if (sortKey === 'name' || sortKey === 'category') {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        result = aValue.localeCompare(bValue);
      } else if (sortKey === 'expiryDate') {
        const aValue = a.expiryDate;
        const bValue = b.expiryDate;
        if (aValue && bValue) {
          if (aValue < bValue) result = -1;
          else if (aValue > bValue) result = 1;
        } else if (aValue) {
          result = -1;
        } else if (bValue) {
          result = 1;
        }
      }
      return sortOrder === 'asc' ? result : -result;
    });
  }, [items, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Завантаження продуктів...</p>;
  }
  if (error) {
    return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Помилка: {error}</p>;
  }
  if (!isLoading && items.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Ваша комора порожня.</p>;
  }

  return (
    <table className={styles.pantryTable}>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>Назва {getSortArrow('name')}</th>
          <th onClick={() => handleSort('quantity')}>Кількість {getSortArrow('quantity')}</th>
          <th onClick={() => handleSort('category')}>Категорія {getSortArrow('category')}</th>
          <th onClick={() => handleSort('expiryDate')}>
            Термін придатності {getSortArrow('expiryDate')}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item) => {
          const expiryInfo = getExpiryInfo(item.expiryDate);

          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                {item.quantity} {item.unit}
              </td>
              <td>{item.category}</td>
              <td>
                {formatDate(item.expiryDate)}

                {expiryInfo.text && (
                  <span className={`${styles.daysLeft} ${expiryInfo.colorClass}`}>
                    {expiryInfo.text}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
