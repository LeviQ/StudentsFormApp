import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

function Home() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const handleOpenModal = (survey) => {
    setIsModalOpen(true);
    setSelectedSurvey(survey);
    
    document.querySelector('.Page-container').classList.add('blur');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.querySelector('.Page-container').classList.remove('blur');
  };

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
            <button onClick={() => handleOpenModal(survey)} className="fill-survey-button">Wypełnij ankietę</button>
          </div>
        ))
      ) : (
        <p>Brak ankiet do wypełnienia.</p>
      )}
    </div>
    {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2><strong>Ankieta Studencka:  {selectedSurvey?.SubjectName}, {selectedSurvey?.ClassTypeName}</strong></h2>
            <form>
        <label className='Questionn'>Pytanie 1. Jak ogólnie oceniasz zajęcia w skali od 1 do 5?</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question1" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Oceń na ile się zgadzasz z danym stwierdzeniem w skali od 1 do 5</label>
        <label className='Questionn'>Stwierdzenie 1. Na pierwszych zajęciach osoba prowadząca określiła, zgodnie z sylabusem, założenia i zasady zaliczania przedmiotu.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question2" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 2. Uzyskano od osoby prowadzącej odpowiedzi na pytania zadawane w czasie zajęć i/lub konsultacji.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question3" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 3. Osoby studiujące były traktowane przez osobę prowadzącą z szacunkiem i zgodnie z zasadą równego traktowania.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question4" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 4. Określone w sylabusie zasady zaliczenia przedmiotu były przestrzegane.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question5" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 5. Prezentowany przez osobę prowadzącą materiał rozwinął moją wiedzę i/lub umiejętności.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question6" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 6. Zajęcia oceniam jako interesujące.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="question7" value={value}></input>
            </label>
          ))}
        </div>
        <label className = 'Questionn'>Twój komentarz pod adresem osoby prowadzącej zajęcia: </label>
        <textarea name="comment" />
        <button type="submit" className='s2'>Prześlij Ankietę</button>
      </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;