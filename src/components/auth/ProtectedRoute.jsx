import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    // Arahkan ke halaman login admin dengan mengingat halaman asal
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

