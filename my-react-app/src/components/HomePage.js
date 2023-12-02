import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

function Home() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedSurveys, setCompletedSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleOpenModal = (survey) => {
    setIsModalOpen(true);
    setSelectedSurvey(survey);
    
    document.querySelector('.Page-container').classList.add('blur');
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const responses = {
      OfferingID: selectedSurvey.OfferingID,
      Answer1: formData.get('answer1'),
      Answer2: formData.get('answer2'),
      Answer3: formData.get('answer3'),
      Answer4: formData.get('answer4'),
      Answer5: formData.get('answer5'),
      Answer6: formData.get('answer6'),
      Answer7: formData.get('answer7'),
      OpenQuestion: formData.get('OpenQuestion')
    };

    try {
      const response = await axios.post('http://localhost:5007/api/SurveysResponse/SubmitResponse', responses, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setSurveys(prevSurveys => prevSurveys.filter(survey => survey.OfferingID !== selectedSurvey.OfferingID));
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 2000); 
        setIsModalOpen(false); 
      } else {
        
        setError('Nie udało się przesłać ankiety. Proszę spróbować później.');
      }
    } catch (error) {
      
      console.error('Wystąpił błąd przy przesyłaniu ankiety:', error);
      setError('Wystąpił błąd przy przesyłaniu ankiety. Proszę spróbować później.');
    }
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
      {showSuccessMessage && <div className="success-message2">Ankieta została pomyślnie przesłana!</div>}
      <div className='Header'>
        Witaj na Platformie Ankiet Studenckich!
      <button onClick={handleLogout} className="logoutButton">
        Wyloguj się
      </button>
      </div>
    <div className="surveys-container">
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
            <form onSubmit={handleSurveySubmit}>
        <label className='Questionn'>Pytanie 1. Jak ogólnie oceniasz zajęcia w skali od 1 do 5?</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer1" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Oceń na ile się zgadzasz z danym stwierdzeniem w skali od 1 do 5</label>
        <label className='Questionn'>Stwierdzenie 1. Na pierwszych zajęciach osoba prowadząca określiła, zgodnie z sylabusem, założenia i zasady zaliczania przedmiotu.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer2" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 2. Uzyskano od osoby prowadzącej odpowiedzi na pytania zadawane w czasie zajęć i/lub konsultacji.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer3" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 3. Osoby studiujące były traktowane przez osobę prowadzącą z szacunkiem i zgodnie z zasadą równego traktowania.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer4" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 4. Określone w sylabusie zasady zaliczenia przedmiotu były przestrzegane.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer5" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 5. Prezentowany przez osobę prowadzącą materiał rozwinął moją wiedzę i/lub umiejętności.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer6" value={value}></input>
            </label>
          ))}
        </div>
        <label className='Questionn'>Stwierdzenie 6. Zajęcia oceniam jako interesujące.</label>
        <div className="form-question">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <span className="radio-label">{value}</span>
              <input type="radio" name="answer7" value={value}></input>
            </label>
          ))}
        </div>
        <label className = 'Questionn'>Twój komentarz pod adresem osoby prowadzącej zajęcia: </label>
        <textarea name="OpenQuestion"/>
        <button type="submit" className='s2'>Prześlij Ankietę</button>
      </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;