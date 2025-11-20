import React, { useState } from 'react';
import { Modal } from '@/shared/components/Modal.tsx';
import { Input } from '@/shared/components/Input.tsx';
import { Button } from '@/shared/components/Button.tsx';
import { useShoppingListStore } from '../state/useShoppingListStore';
import type { UnitType } from '@/shared/types/domain-types.ts';
import type { AddPantryItemDto } from '../../pantry/types/pantry-types';
// 1. Імпортуємо ВЛАСНІ стилі
import styles from './AddShoppingItemModal.module.css';

const units: UnitType[] = ['г', 'кг', 'мл', 'л', 'шт', 'уп'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getStep = (unit: UnitType): string => {
  // Для цільних одиниць (грами, мілілітри, штуки) крок 1
  if (['г', 'мл', 'шт', 'уп'].includes(unit)) {
    return '1';
  }
  // Для дробових (кілограми, літри) крок 0.1
  return '0.1';
};

export const AddShoppingItemModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const addItem = useShoppingListStore((state) => state.addItem);
  const isLoading = useShoppingListStore((state) => state.isLoading);
  const error = useShoppingListStore((state) => state.error);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitType>('шт');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity <= 0) {
      alert('Будь ласка, заповніть назву та кількість');
      return;
    }

    const newItem: AddPantryItemDto = {
      name,
      quantity,
      unit,
    };

    const success = await addItem(newItem);
    if (success) {
      setName('');
      setQuantity(1);
      setUnit('шт');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Додати до списку">
      <form
        onSubmit={handleSubmit}
        className={styles.form} // 2. Використовуємо клас форми
        noValidate
      >
        <Input label="Назва" value={name} onChange={(e) => setName(e.target.value)} required />

        <div className={styles.row}>
          {' '}
          {/* 3. Використовуємо клас рядка */}
          <Input
            label="Кількість"
            type="number"
            value={quantity}
            required
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            step={getStep(unit)}
          />
          <div className={styles.unitWrapper}>
            {' '}
            {/* 4. Обгортка для селекта */}
            <label className={styles.label}>Од. виміру</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
              className={styles.select} // 5. Стиль селекта
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Додавання...' : 'Додати'}
        </Button>
      </form>
    </Modal>
  );
};
