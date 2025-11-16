import React, { useState } from 'react';
import { useAuthStore } from '../../features/auth/state/useAuthStore';
import { Input } from '../../shared/components/Input';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, token } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Паролі не співпадають');
      return;
    }
    register(username, email, password);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    // 2. Використовуйте імпортовані стилі через className
    <div className={styles.container}>
      <h2>Реєстрація у Smart Pantry</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Ім'я користувача"
          type="text"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Input
          label="Підтвердження пароля"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className={styles.errorText}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
        <button type="button" onClick={() => navigate('/login')} className={styles.loginButton}>
          Увійти
        </button>
      </form>
    </div>
  );
};
