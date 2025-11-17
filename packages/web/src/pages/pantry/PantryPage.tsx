import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../shared/layouts/PageLayout';
import { PantryList } from '../../features/pantry/components/PantryList';
import { useAuthStore } from '../../features/auth/state/useAuthStore';
import { Button } from '../../shared/components/Button';
import styles from './PantryPage.module.css';
import { AddItemModal } from '../../features/pantry/components/AddItemModal';

export const PantryPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddItemClick = () => {
    setIsModalOpen(true);
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
        </div>
      </div>

      <PantryList />

      <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageLayout>
  );
};
