import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Wrapper that checks the logged‑in user's role before rendering children.
 * If the user does not have one of the allowedRoles, they are redirected to
 * the generic admin dashboard (or login if not authenticated).
 */
export default function RoleProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();

  // Not logged in – send to login page preserving intended location
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const user = authService.getCurrentUser();
  const hasRole = user && allowedRoles.includes(user.role);

  if (!hasRole) {
    // Role mismatch – redirect ke dashboard yang sesuai dengan rolenya
    const target = user?.role === 'admin_tjsl' ? '/admin/tjsl' : '/admin';
    return <Navigate to={target} replace />;
  }

  return children || <>{null}</>;
}

