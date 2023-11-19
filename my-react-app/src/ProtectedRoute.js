import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Użytkownik nie jest zalogowany
    return <Navigate to="/login" />;
  }

  return children; // Użytkownik jest zalogowany
};

export default ProtectedRoute;