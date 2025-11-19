import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { usePantryStore } from '../state/usePantryStore';
import type { AddPantryItemDto } from '../types/pantry-types';
import type { IProduct, UnitType } from '../../../shared/types/domain-types';
import styles from './AddItemModal.module.css';
import { getProductList } from '../../product/api/productApi';

const units: UnitType[] = ['г', 'кг', 'мл', 'л', 'шт', 'уп'];

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState<UnitType>('шт');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);

  const [productList, setProductList] = useState<IProduct[]>([]);
  const addItem = usePantryStore((state) => state.addItem);
  const isLoading = usePantryStore((state) => state.isLoading);
  const error = usePantryStore((state) => state.error);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        const products = await getProductList();
        setProductList(products);
      };
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    const foundProduct = productList.find((p) => p.name.toLowerCase() === name.toLowerCase());

    if (foundProduct) {
      setCategory(foundProduct.category);
      setIsCategoryLocked(true);
    } else {
      setIsCategoryLocked(false);
      setCategory('');
    }
  }, [name, productList]);

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
      expiryDate: expiryDate || undefined,
      category: category || undefined,
    };

    const success = await addItem(newItem);

    if (success) {
      setName('');
      setQuantity(0);
      setUnit('шт');
      setExpiryDate('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Додати продукт у комору">
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <Input
            label="Назва продукту"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            list="product-list"
          />
        </div>

        <datalist id="product-list">
          {productList.map((product) => (
            <option key={product.id} value={product.name} />
          ))}
        </datalist>

        <div className={styles.formRow}>
          <Input
            label="Категорія"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isCategoryLocked}
            placeholder={isCategoryLocked ? 'Категорія з довідника' : 'Напр: Молочне (опціонально)'}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            label="Кількість"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={0.01}
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
            label="Термін придатності (опціонально)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Додавання...' : 'Додати'}
        </Button>
      </form>
    </Modal>
  );
};
