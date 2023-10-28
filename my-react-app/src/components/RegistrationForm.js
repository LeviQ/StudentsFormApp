import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function RegistrationForm() {
    const [studentData, setStudentData] = useState({
        AlbumNumber: '',
        StudentPasswordHash: '',  // Sugeruję zastosowanie nazwy 'Password' zamiast 'StudentPasswordHash', ale to zależy od Twojego backendu
        FieldOfStudy: '',
        YearNumber: '',           // Zmieniłem wartość początkową na pusty ciąg, zamiast 0
        Semester: ''              // Podobnie jak wyżej
    });


    const [errors, setErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // Pomylsna rejestracja
    const [duplicateAlbumError, setDuplicateAlbumError] = useState(false); // Zajety numer albumu 
    const [isSubmitting, setIsSubmitting] = useState(false); // Zabezpieczenie autoklikanie 
    const [isPasswordVisible, setPasswordVisibility] = useState(false); //Widocznosc hasła

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
    
        // Walidacja roku studiów
        const validYearNumbers = [1, 2, 3];
        if (!validYearNumbers.includes(Number(studentData.YearNumber))) {
          errors.YearNumber = "Rok studiów może być 1, 2 lub 3.";
        }
    
        // Walidacja semestru
        if (studentData.Semester < 1 || studentData.Semester > 7) {
          errors.Semester = "Semestr powinien być w zakresie od 1 do 7.";
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
            YearNumber: parseInt(studentData.YearNumber),
            Semester: parseInt(studentData.Semester)
        };

        axios.post('http://localhost:5007/api/Registration', dataToSend)
            .then(response => {
                console.log(response.data);
                setRegistrationSuccess(true);
                setTimeout(() => {
                    setRegistrationSuccess(false);
                    setIsSubmitting(false);
                }, 2000);
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
                    <input
                        type={isPasswordVisible ? "text" : "password"} 
                        value={studentData.StudentPasswordHash}
                        onChange={e => setStudentData({ ...studentData, StudentPasswordHash: e.target.value })}
                        placeholder="Wpisz Hasło"
                    />
                    <FontAwesomeIcon 
                        icon={isPasswordVisible ? faEyeSlash : faEye} 
                        onClick={() => setPasswordVisibility(!isPasswordVisible)} 
                        style={{ cursor: "pointer", color: "#2C3E50", fontSize: "1.3em"}}
                        className="eye-icon"
                    />
                    <h3>Kierunek Studiów</h3>
                    <input
                        value={studentData.FieldOfStudy}
                        onChange={e => setStudentData({ ...studentData, FieldOfStudy: e.target.value })}
                        placeholder="Uzupełnij Kierunek studiów"
                    />
                    {errors.FieldOfStudy && <p className="error">{errors.FieldOfStudy}</p>}
                    <h3>Rok studiów</h3>
                    <input
                        type="number"
                        value={studentData.YearNumber}
                        onChange={e => setStudentData({ ...studentData, YearNumber: e.target.value })}
                        placeholder="Wybierz Rok studiów"
                    />
                    {errors.YearNumber && <p className="error">{errors.YearNumber}</p>}
                    <h3>Semestr</h3>
                    <input
                        type="number"
                        value={studentData.Semester}
                        onChange={e => setStudentData({ ...studentData, Semester: e.target.value })}
                        placeholder="Wybierz Semestr"
                    />
                    {errors.Semester && <p className="error">{errors.Semester}</p>}
                    <h1>Posiadasz już konto? <a href="https://twojadomena.com/logowanie">Zaloguj się</a></h1>
                    <button type="submit" disabled={isSubmitting}>Zarejestruj się</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default RegistrationForm;