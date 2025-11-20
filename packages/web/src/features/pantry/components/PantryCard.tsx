import React from 'react';
import type { IPantryItem } from '../types/pantry-types';
import styles from './PantryCard.module.css';

interface PantryCardProps {
  item: IPantryItem;
}

const getIconByCategory = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('молочн')) return '🥛';
  if (cat.includes("м'яс") || cat.includes('meat')) return '🥩';
  if (cat.includes('овоч') || cat.includes('veg')) return '🥦';
  if (cat.includes('фрукт') || cat.includes('fruit')) return '🍎';
  if (cat.includes('бакалія') || cat.includes('хліб')) return '🍞';
  if (cat.includes('напої')) return '🧃';
  return '📦';
};

const getExpiryInfo = (dateString?: string) => {
  if (!dateString) return null;
  const today = new Date();
  const expiryDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `Прострочено ${-diffDays} дн.`, className: styles.expired };
  if (diffDays === 0) return { text: 'Сьогодні!', className: styles.warn };
  if (diffDays <= 5) return { text: `${diffDays} дні`, className: styles.warn };
  return { text: `${diffDays} днів`, className: styles.safe };
};

export const PantryCard: React.FC<PantryCardProps> = ({ item }) => {
  const expiryInfo = getExpiryInfo(item.expiryDate);
  const icon = getIconByCategory(item.category);

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>{icon}</div>

      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <div className={styles.details}>
          {item.quantity} {item.unit}
        </div>

        {expiryInfo ? (
          <div className={`${styles.expiryTag} ${expiryInfo.className}`}>{expiryInfo.text}</div>
        ) : (
          <div className={styles.details} style={{ fontSize: '12px' }}>
            Без терміну
          </div>
        )}
      </div>
    </div>
  );
};
