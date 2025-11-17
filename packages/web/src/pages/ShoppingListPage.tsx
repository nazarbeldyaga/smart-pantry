import React from 'react';
import { PageLayout } from '../shared/layouts/PageLayout';
import { Link } from 'react-router-dom';

export const ShoppingListPage: React.FC = () => {
  return (
    <PageLayout>
      <h1>Мій Список Покупок</h1>
      <p>Тут буде список покупок...</p>
      <Link to="/">Повернутися до комори</Link>
    </PageLayout>
  );
};
