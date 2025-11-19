import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useShoppingListStore } from '../state/useShoppingListStore';
import type { UnitType } from '../../../shared/types/domain-types';
import type { AddPantryItemDto } from '../../pantry/types/pantry-types.ts';
import styles from '../../pantry/components/AddItemModal.module.css';

const units: UnitType[] = ['г', 'кг', 'мл', 'л', 'шт', 'уп'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        noValidate
      >
        <Input label="Назва" value={name} onChange={(e) => setName(e.target.value)} required />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            label="Кількість"
            type="number"
            value={quantity}
            required
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={0.01}
          />
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Од. виміру
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
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
