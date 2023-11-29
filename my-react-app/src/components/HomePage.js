import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

function Home() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5007/api/Surveys/GetSurveys', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setSurveys(response.data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        
      }
    };
    fetchSurveys();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='Page-container'>
      <div className='Header'>
        Witaj na Platformie Ankiet Studenckich!
      <button onClick={handleLogout} className="logoutButton">
        Wyloguj się
      </button>
      </div>
    <div className="surveys-container">
      
      {/* Mapowanie stanu 'surveys' na kafelki */}
      {surveys.length > 0 ? (
        surveys.map((survey) => (
          <div key={survey.OfferingID} className="survey-card">
            <h2>{survey.SubjectName}</h2>
            <p><em>Rodzaj zajęć: </em><strong>{survey.ClassTypeName}</strong></p>
            <p><em>Prowadzący: </em><strong> {survey.InstructorTitle} {survey.InstructorName}</strong></p>
            {/* Przycisk do wypełnienia ankiety może być dodany tutaj, jeśli jest potrzebny */}
            <button className="fill-survey-button">Wypełnij ankietę</button>
          </div>
        ))
      ) : (
        <p>Brak ankiet do wypełnienia.</p>
      )}
    </div>
    </div>
  );
}

export default Home;