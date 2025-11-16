// web/src/shared/layouts/PageLayout.tsx
import React from 'react';
import { useAuthStore } from '../../features/auth/state/useAuthStore.ts';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
      <header
        style={{
          padding: '20px',
          background: '#f4f4f4',
          borderBottom: '1S solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>Smart Pantry</h2>
        <button
          onClick={logout}
          style={{
            background: '#FF5722',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
          }}
        >
          Вийти
        </button>
      </header>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
};
