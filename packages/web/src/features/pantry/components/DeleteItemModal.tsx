import React, { useState, useMemo } from 'react';
import { Modal } from '@/shared/components/Modal.tsx';
import { Input } from '@/shared/components/Input.tsx';
import { Button } from '@/shared/components/Button.tsx';
import { usePantryStore } from '../state/usePantryStore';
import type { IPantryItem } from '../types/pantry-types';
import styles from './DeleteItemModal.module.css';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('uk-UA');
};

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ isOpen, onClose }) => {
  const allPantryItems = usePantryStore((state) => state.items);

  const deleteItems = usePantryStore((state) => state.deleteItems);

  const [selectedName, setSelectedName] = useState('');
  const [selectedInstanceId, setSelectedInstanceId] = useState('');

  const [itemsToDelete, setItemsToDelete] = useState<IPantryItem[]>([]);

  const uniqueProductNames = useMemo(() => {
    return [...new Set(allPantryItems.map((item) => item.name))];
  }, [allPantryItems]);

  const availableInstances = useMemo(() => {
    return allPantryItems.filter(
      (item) => item.name === selectedName && !itemsToDelete.find((d) => d.id === item.id)
    );
  }, [allPantryItems, selectedName, itemsToDelete]);

  const handleNameChange = (name: string) => {
    setSelectedName(name);
    setSelectedInstanceId('');
  };

  const handleInstanceSelect = (instanceId: string) => {
    if (!instanceId) return;

    const itemToAdd = allPantryItems.find((item) => item.id === instanceId);
    if (itemToAdd) {
      setItemsToDelete((prev) => [...prev, itemToAdd]);
      setSelectedName('');
      setSelectedInstanceId('');
    }
  };

  const handleRemoveFromStaging = (itemId: string) => {
    setItemsToDelete((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemIds = itemsToDelete.map((item) => item.id);

    const success = await deleteItems(itemIds);

    if (success) {
      setItemsToDelete([]);
      setSelectedName('');
      setSelectedInstanceId('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Видалити продукти з комори">
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <Input
            label="1. Оберіть назву продукту"
            type="text"
            value={selectedName}
            onChange={(e) => handleNameChange(e.target.value)}
            list="pantry-product-list"
            placeholder="Почніть вводити назву..."
          />
          <datalist id="pantry-product-list">
            {uniqueProductNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>2. Оберіть екземпляр для видалення</label>
          <select
            value={selectedInstanceId}
            onChange={(e) => handleInstanceSelect(e.target.value)}
            className={styles.select}
            disabled={!selectedName || availableInstances.length === 0}
          >
            <option value="">
              {!selectedName
                ? 'Спочатку оберіть назву'
                : availableInstances.length === 0
                  ? 'Всі екземпляри вже додані'
                  : 'Оберіть екземпляр...'}
            </option>

            {availableInstances.map((item) => (
              <option key={item.id} value={item.id}>
                {`${item.name} (${item.quantity} ${item.unit}) - до ${formatDate(item.expiryDate)}`}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>3. Список до видалення</label>
          <div className={styles.deleteList}>
            {itemsToDelete.length === 0 ? (
              <p className={styles.deleteListPlaceholder}>Додайте продукти зі списку вище</p>
            ) : (
              itemsToDelete.map((item) => (
                <div key={item.id} className={styles.deleteListItem}>
                  <span className={styles.itemText}>
                    {`${item.name} (до ${formatDate(item.expiryDate)})`}
                  </span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveFromStaging(item.id)}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <Button type="submit" style={{ width: '100%' }} disabled={itemsToDelete.length === 0}>
          {`Видалити (${itemsToDelete.length}) ${itemsToDelete.length === 1 ? 'продукт' : 'продукти'}`}
        </Button>
      </form>
    </Modal>
  );
};
