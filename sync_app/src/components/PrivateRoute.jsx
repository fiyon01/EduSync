import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Named import

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);  // Use the named import
    const expirationDate = decodedToken.exp * 1000;

    if (expirationDate < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/auth/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;