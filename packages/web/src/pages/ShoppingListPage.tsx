import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../shared/layouts/PageLayout';
import { useShoppingListStore } from '../features/shopping-list/state/useShoppingListStore';
import { Button } from '../shared/components/Button';
import { AddShoppingItemModal } from '../features/shopping-list/components/AddShoppingItemModal';

export const ShoppingListPage: React.FC = () => {
  const { items, fetchItems, toggleItem, deleteItem, completeShopping } = useShoppingListStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const boughtCount = items.filter((i) => i.isChecked).length;

  return (
    <PageLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>📝 Список Покупок</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/">
            <Button variant="green" style={{ marginRight: '10px' }}>
              ← У комору
            </Button>
          </Link>
          <Button onClick={() => setIsAddModalOpen(true)} variant="green">
            + Додати
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          Список порожній. Саме час щось запланувати!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                opacity: item.isChecked ? 0.6 : 1,
                textDecoration: item.isChecked ? 'line-through' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => toggleItem(item.id)}
                style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{item.name}</span>
                <span style={{ marginLeft: '10px', color: '#555' }}>
                  {item.quantity} {item.unit}
                </span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ff4d4f',
                  fontSize: '20px',
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {boughtCount > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Button
            onClick={completeShopping}
            variant="blue"
            style={{ padding: '15px 30px', fontSize: '18px' }}
          >
            ✅ Купити обрані ({boughtCount})
          </Button>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            Обрані товари будуть переміщені у вашу Комору
          </p>
        </div>
      )}

      <AddShoppingItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageLayout>
  );
};
