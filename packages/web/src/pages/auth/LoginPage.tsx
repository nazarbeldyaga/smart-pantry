import React, { useState } from 'react';
import { useAuthStore } from '../../features/auth/state/useAuthStore';
import { Input } from '../../shared/components/Input';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, token } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h2>Вхід у Smart Pantry</h2>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Електронна пошта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.errorText}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Завантаження...' : 'Увійти'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className={styles.registerButton}
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
};
