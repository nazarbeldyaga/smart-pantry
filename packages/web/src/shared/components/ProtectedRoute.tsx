import React from 'react';
import { useAuthStore } from '../../features/auth/state/useAuthStore';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
