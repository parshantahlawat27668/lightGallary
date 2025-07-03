import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = ({ user, children }) => {
  const location = useLocation();
  const path = location.pathname;

  // ✅ Public routes allowed without login
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-phone',
    // future: '/auth/forgot-password', '/auth/verify-email', etc.
  ];

  // ✅ Homepage redirect
  if (path === '/') {
    if (!user) {
      return <Navigate to="/auth/login" />;
    } else {
      return user.role === 'admin'
        ? <Navigate to="/admin/dashboard" />
        : <Navigate to="/shop/home" />;
    }
  }

  // ✅ Block private routes if not logged in
  if (!user && !publicPaths.includes(path)) {
    return <Navigate to="/auth/login" />;
  }

  // ✅ Prevent normal user from accessing admin routes
  if (user?.role !== 'admin' && path.startsWith('/admin')) {
    return <Navigate to="/unauth-page" />;
  }

  // ✅ Prevent admin from accessing user routes
  if (user?.role === 'admin' && path.startsWith('/shop')) {
    return <Navigate to="/admin/dashboard" />;
  }

  // ✅ All good, render the component
  return <>{children}</>;
};

export default CheckAuth;
