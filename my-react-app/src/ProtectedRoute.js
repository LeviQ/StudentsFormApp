import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, forAdmin}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  
  // Sprawdź, czy trasa jest przeznaczona dla admina i czy użytkownik jest adminem
  if (forAdmin && decodedToken.IsSuperUser !== 'Yes') {
    // Użytkownik nie jest superuserem, przekieruj na stronę główną
    return <Navigate to="/home" />;
  }
  
  // Użytkownik ma odpowiednie uprawnienia, renderuj komponent
  return children;

};

export default ProtectedRoute;