import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';


function RegistrationForm() {
    const [studentData, setStudentData] = useState({
        AlbumNumber: '',
        StudentPassword: '',  
        FieldOfStudy: '',
        GroupName: '',           
        Semester: ''              
    });

    const [errors, setErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // Pomylsna rejestracja
    const [duplicateAlbumError, setDuplicateAlbumError] = useState(false); // Zajety numer albumu 
    const [isSubmitting, setIsSubmitting] = useState(false); // Zabezpieczenie autoklikanie 
    const [isPasswordVisible, setPasswordVisibility] = useState(false); //Widocznosc hasła
    const navigate = useNavigate();

    useEffect(() => {
        if (registrationSuccess) {
            const timeout = setTimeout(() => {
                setRegistrationSuccess(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [registrationSuccess]);

    const validate = () => {
        let errors = {};
    
        // Walidacja numeru albumu
        if (studentData.AlbumNumber.length < 3 || studentData.AlbumNumber.length > 7) {
          errors.AlbumNumber = "Numer albumu powinien zawierać od 3 do 7 cyfr.";
        }
    
        // Walidacja kierunku studiów
        const validFieldsOfStudy = ["Informatyka", "Informatyka i Ekonometria"];
        if (!validFieldsOfStudy.includes(studentData.FieldOfStudy)) {
          errors.FieldOfStudy = "Wybierz Informatykę lub Informatykę i Ekonometrię.";
        }
    
        if (studentData.Semester >= 1 && studentData.Semester <= 4) {
            // Dla semestrów 1-4, dozwolone są grupy 1-7
            const validGroupNamesForLowerSemesters = ["1","2","3","4","5","6","7"];
            if (!validGroupNamesForLowerSemesters.includes(studentData.GroupName)) {
              errors.GroupName = "Wpisz poprawną Grupę Studencką dla semestrów 1-4.";
            }
          } else if (studentData.Semester >= 5 && studentData.Semester <= 7) {
            // Dla semestrów 5-7, dozwolone są grupy ISI-1, ISI-2, SIAG, TM, ISK
            const validGroupNamesForHigherSemesters = ["ISI-1","ISI-2","SIAG","TM","ISK"];
            if (!validGroupNamesForHigherSemesters.includes(studentData.GroupName)) {
              errors.GroupName = "Wpisz poprawną Grupę Studencką dla semestrów 5-7.";
            }
          } else {
            // Jeśli semestr nie jest w zakresie 1-7, zwróć błąd
            errors.Semester = "Semestr powinien być w zakresie od 1 do 7.";
          }
    
        // Walidacja semestru
        if (studentData.Semester < 1 || studentData.Semester > 7) {
          errors.Semester = "Semestr powinien być w zakresie od 1 do 7.";
        }

        if (studentData.GroupName === ''){
            errors.GroupName = "Uzupełnij Grupę Studencką";
        }
    
        setErrors(errors);
        return Object.keys(errors).length === 0;
      };

      
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        const dataToSend = {
            ...studentData,
            Semester: parseInt(studentData.Semester)
        };

        axios.post('http://localhost:5007/api/Registration', dataToSend)
            .then(response => {
                console.log(response.data);
                setRegistrationSuccess(true);
                setTimeout(() => {
                    setRegistrationSuccess(false);
                    setIsSubmitting(false);
                    navigate('/login'); // Tutaj dodajemy przekierowanie do logowania
                }, 2500); 
            })
            .catch(error => {
                console.error("Błąd podczas rejestracji:", error);
                if (error.response && error.response.data === "Student o podanym numerze albumu już istnieje.") { 
                    setDuplicateAlbumError(true);
                    setTimeout(() => {
                        setDuplicateAlbumError(false);
                        setIsSubmitting(false);
                    }, 2000);
                }
            });
    };

    return (
        <>
        {registrationSuccess && 
            <div className={`success-message ${registrationSuccess ? 'active' : ''}`}>
                Pomyślnie zarejestrowano konto!
            </div>}
        {duplicateAlbumError &&
        <div className={`error-message ${duplicateAlbumError ? 'active' : ''}`}>
            Numer Albumu jest zajęty!
        </div>
    }
    <div className='PP'>
        <div className="container">
            <div className="image-container">
                <img src='LeftImage.png' alt="Opis obrazka" />
            </div>
            <div className="signup-side">
                <form onSubmit={handleSubmit}>
                <h2>Zarejestruj Swoje Konto</h2>
                <h1>Twoje zdanie ma znaczenie! Dołącz do naszej społeczności i wpływaj na życie akademickie.</h1>
                <h3>Numer Albumu</h3>
                    <input 
                        value={studentData.AlbumNumber}
                        onChange={e => setStudentData({ ...studentData, AlbumNumber: e.target.value })}
                        placeholder="Uzupełnij Numer albumu"
                    />
                    {errors.AlbumNumber && <p className="error">{errors.AlbumNumber}</p>}
                    <h3>Hasło</h3>
                    <div style={{ position: 'relative'}}>
                    <input
                        type={isPasswordVisible ? "text" : "password"} 
                        value={studentData.StudentPassword}
                        onChange={e => setStudentData({ ...studentData, StudentPassword: e.target.value })}
                        placeholder="Wpisz Hasło"
                    />
                    <FontAwesomeIcon 
                        icon={isPasswordVisible ? faEyeSlash : faEye} 
                        onClick={() => setPasswordVisibility(!isPasswordVisible)} 
                        style={{ cursor: "pointer", color: "#2C3E50", fontSize: "1.3em"}}
                        className="eye-icon"
                    />
                    </div>
                    <h3>Kierunek Studiów</h3>
                    <input
                        value={studentData.FieldOfStudy}
                        onChange={e => setStudentData({ ...studentData, FieldOfStudy: e.target.value })}
                        placeholder="Uzupełnij Kierunek studiów"
                    />
                    {errors.FieldOfStudy && <p className="error">{errors.FieldOfStudy}</p>}
                    <h3>Grupa Studencka</h3>
                    <input
                        type="text"
                        value={studentData.GroupName}
                        onChange={e => setStudentData({ ...studentData, GroupName: e.target.value })}
                        placeholder="Wpisz Grupę Studencką"
                    />
                    {errors.GroupName && <p className="error">{errors.GroupName}</p>}
                    <h3>Semestr</h3>
                    <input
                        type="number"
                        value={studentData.Semester}
                        onChange={e => setStudentData({ ...studentData, Semester: e.target.value })}
                        placeholder="Wybierz Semestr"
                        min='1' max='7' step ='1'
                    />
                    {errors.Semester && <p className="error">{errors.Semester}</p>}
                    <h1>Posiadasz już konto? <a href="/login">Zaloguj się</a></h1>
                    <button type="submit" className='Registration' disabled={isSubmitting}>Zarejestruj się</button>
                </form>
            </div>
        </div>
        </div>
      </>
    );
}

export default RegistrationForm;