import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/shared/components/Modal.tsx';
import { Input } from '@/shared/components/Input.tsx';
import { Button } from '@/shared/components/Button.tsx';
import { usePantryStore } from '../state/usePantryStore';
import type { AddPantryItemDto } from '../types/pantry-types';
import type { UnitType } from '@/shared/types/domain-types.ts';
import styles from './EditItemModal.module.css';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('uk-UA');
};
const units: UnitType[] = ['г', 'кг', 'мл', 'л', 'шт', 'уп'];

interface EditItemModalProps {
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

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose }) => {
  const allPantryItems = usePantryStore((state) => state.items);
  const updateItem = usePantryStore((state) => state.updateItem);
  const isLoading = usePantryStore((state) => state.isLoading);
  const error = usePantryStore((state) => state.error);

  const [searchName, setSearchName] = useState('');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const [itemId, setItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState<UnitType>('шт');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isMasterProduct, setIsMasterProduct] = useState(false);

  const uniqueProductNames = useMemo(
    () => [...new Set(allPantryItems.map((item) => item.name))],
    [allPantryItems]
  );
  const availableInstances = useMemo(
    () => allPantryItems.filter((item) => item.name === searchName),
    [allPantryItems, searchName]
  );

  useEffect(() => {
    if (itemId && isOpen) {
      const item = allPantryItems.find((i) => i.id === itemId);
      if (item) {
        setItemName(item.name);
        setQuantity(item.quantity);
        setUnit(item.unit);
        setCategory(item.category);
        setExpiryDate(item.expiryDate || '');

        setIsMasterProduct(item.productId !== null);
      }
    }
  }, [itemId, allPantryItems, isOpen]);

  const handleStartEdit = () => {
    if (selectedInstanceId) {
      setItemId(selectedInstanceId);
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || quantity <= 0) return;

    const updatedData: AddPantryItemDto = {
      name: itemName,
      quantity,
      unit,
      category: isMasterProduct ? category : category || 'Інше',
      expiryDate: expiryDate || undefined,
    };

    const success = await updateItem(itemId, updatedData);

    if (success) {
      onClose();
    }
  };

  const handleCloseAndReset = () => {
    setItemId(null);
    setSelectedInstanceId(null);
    setSearchName('');
    setIsEditing(false);
    onClose();
  };

  const renderSelectionStep = () => (
    <>
      <div className={styles.formRow}>
        <Input
          label="1. Оберіть назву продукту"
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          list="edit-pantry-names-list"
          placeholder="Почніть вводити назву..."
        />
        <datalist id="edit-pantry-names-list">
          {uniqueProductNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>2. Оберіть екземпляр для редагування</label>
        <select
          value={selectedInstanceId || ''}
          onChange={(e) => setSelectedInstanceId(e.target.value)}
          className={styles.select}
          disabled={!searchName || availableInstances.length === 0}
        >
          <option value="">
            {availableInstances.length === 0 ? 'Немає екземплярів' : 'Оберіть один екземпляр...'}
          </option>
          {availableInstances.map((item) => (
            <option key={item.id} value={item.id}>
              {`${item.name} (${item.quantity} ${item.unit}) - до ${formatDate(item.expiryDate)}`}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleStartEdit}
        style={{ width: '100%', marginTop: '30px' }}
        disabled={!selectedInstanceId}
      >
        Редагувати обраний продукт
      </Button>
    </>
  );

  const renderEditForm = () => (
    <>
      <p className={styles.editingInfo}>
        Редагування **{itemName}** (ID: {itemId})
      </p>

      <div className={styles.formRow}>
        <Input label="Назва продукту" type="text" value={itemName} required disabled={true} />
      </div>

      <div className={styles.formRow}>
        <Input
          label="Кількість"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          min={1}
          step={getStep(unit)}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>Одиниця виміру</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as UnitType)}
          className={styles.select}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formRow}>
        <Input
          label="Термін придатності"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <Input
          label="Категорія"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isMasterProduct}
          placeholder={
            isMasterProduct ? 'Категорія з довідника (заблоковано)' : 'Введіть свою категорію'
          }
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button
        type="submit"
        variant="yellow"
        style={{ width: '100%', marginTop: '20px' }}
        disabled={isLoading}
      >
        {isLoading ? 'Збереження...' : 'Зберегти зміни'}
      </Button>
      <Button
        type="button"
        onClick={() => setIsEditing(false)}
        variant="red"
        style={{ width: '100%', marginTop: '10px' }}
      >
        Скасувати редагування
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseAndReset}
      title={isEditing ? 'Редагування продукту' : 'Оберіть продукт для редагування'}
    >
      <form onSubmit={handleSubmit} noValidate>
        {isEditing ? renderEditForm() : renderSelectionStep()}
      </form>
    </Modal>
  );
};
