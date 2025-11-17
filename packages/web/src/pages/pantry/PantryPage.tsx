import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../shared/layouts/PageLayout';
import { PantryList } from '../../features/pantry/components/PantryList';
import { useAuthStore } from '../../features/auth/state/useAuthStore';
import { Button } from '../../shared/components/Button';
import styles from './PantryPage.module.css';
import { AddItemModal } from '../../features/pantry/components/AddItemModal';
import { DeleteItemModal } from '../../features/pantry/components/DeleteItemModal';

export const PantryPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const navigate = useNavigate();

  const handleAddItemClick = () => {
    setIsModalOpenAdd(true);
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
          <Button
            onClick={handleAddShoppingListClick}
            variant="secondary"
            style={{ marginRight: '10px' }}
          >
            Список покупок
          </Button>
          <Button onClick={handleAddItemClick}>+ Додати продукти</Button>
          <Button onClick={handleDeleteItemClick}>+ Видалити продукти</Button>
        </div>
      </div>

      <PantryList />

      <AddItemModal isOpen={isModalOpenAdd} onClose={() => setIsModalOpenAdd(false)} />
      <DeleteItemModal isOpen={isModalOpenDelete} onClose={() => setIsModalOpenDelete(false)} />
    </PageLayout>
  );
};
