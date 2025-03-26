// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Перенаправляем на страницу входа, сохраняя текущий путь для возможного возврата
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Если аутентифицирован, рендерим дочерний компонент (страницу)
}

export default ProtectedRoute;