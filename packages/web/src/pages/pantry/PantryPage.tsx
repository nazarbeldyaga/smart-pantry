import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../shared/layouts/PageLayout';
import { PantryList } from '../../features/pantry/components/PantryList';
import { useAuthStore } from '@/features/auth/state/useAuthStore.ts';
import { Button } from '../../shared/components/Button';
import styles from './PantryPage.module.css';
import { AddItemModal } from '../../features/pantry/components/AddItemModal';
import { DeleteItemModal } from '../../features/pantry/components/DeleteItemModal';
import { EditItemModal } from '../../features/pantry/components/EditItemModal';

export const PantryPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const navigate = useNavigate();

  const handleAddItemClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleEditItemClick = () => {
    setIsModalOpenEdit(true);
  };

  const handleDeleteItemClick = () => {
    setIsModalOpenDelete(true);
  };

  const handleAddShoppingListClick = () => {
    navigate('/shopping-list');
  };

  return (
    <PageLayout>
      <div className={styles.header}>
        <h1>{user ? `Комора ${user.username}` : 'Моя Комора'}</h1>

        <div className={styles.buttonGroup}>
          <Button onClick={handleAddShoppingListClick} variant="blue">
            Список покупок
          </Button>
          <Button onClick={handleAddItemClick} variant="green">
            + Додати продукти
          </Button>
          <Button onClick={handleEditItemClick} variant="yellow">
            Редагувати продукти
          </Button>
          <Button onClick={handleDeleteItemClick} variant="red">
            - Видалити продукти
          </Button>
        </div>
      </div>

      <PantryList />

      <EditItemModal isOpen={isModalOpenEdit} onClose={() => setIsModalOpenEdit(false)} />
      <AddItemModal isOpen={isModalOpenAdd} onClose={() => setIsModalOpenAdd(false)} />
      <DeleteItemModal isOpen={isModalOpenDelete} onClose={() => setIsModalOpenDelete(false)} />
    </PageLayout>
  );
};
