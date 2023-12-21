import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';

function Admin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleHome = () => {
    navigate('/home');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div className='Page-container-Admin'>
      <div className='Header-Admin'>
        Witaj w Panelu Administracyjnym Ankiet Studenckich
      <button onClick={handleHome} className="SurveyButton">
        Podgląd Ankiet
      </button>
      <button onClick={handleLogout} className="logoutButton">
        Wyloguj się
      </button>
      </div>
    <div className="surveys-container-Admin">
    </div>
    </div>
  );
}

export default Admin;