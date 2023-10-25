import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';


function RegistrationForm() {
    const [studentData, setStudentData] = useState({
        AlbumNumber: '',
        StudentPasswordHash: '',  // Sugeruję zastosowanie nazwy 'Password' zamiast 'StudentPasswordHash', ale to zależy od Twojego backendu
        FieldOfStudy: '',
        YearNumber: '',           // Zmieniłem wartość początkową na pusty ciąg, zamiast 0
        Semester: ''              // Podobnie jak wyżej
    });


    const [errors, setErrors] = useState({});

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

        // Konwersja na liczby całkowite dla pól, które tego wymagają
        const dataToSend = {
            ...studentData,
            YearNumber: parseInt(studentData.YearNumber),
            Semester: parseInt(studentData.Semester)
        };

        axios.post('http://localhost:5007/api/Registration', dataToSend)
            .then(response => {
                console.log(response.data);
                // Tu możesz dodać jakąś akcję po pomyślnej rejestracji, np. przekierowanie czy komunikat
            })
            .catch(error => {
                console.error("Błąd podczas rejestracji:", error);
            });
    };

    return (
        <div className="container">
            <div className="image-container">
                <img src='LeftImage.png' alt="Opis obrazka" />
            </div>
            <div className="signup-side">
                <form onSubmit={handleSubmit}>
                <h2>Zarejestruj Swoje Konto</h2>
                <h1>Twoje zdanie ma znaczenie! Dołącz do naszej społeczności i wpływaj na życie akademickie.</h1>
                    <input 
                        value={studentData.AlbumNumber}
                        onChange={e => setStudentData({ ...studentData, AlbumNumber: e.target.value })}
                        placeholder="Numer albumu"
                    />
                    {errors.AlbumNumber && <p className="error">{errors.AlbumNumber}</p>}
                    <input
                        type="password"
                        value={studentData.StudentPasswordHash}
                        onChange={e => setStudentData({ ...studentData, StudentPasswordHash: e.target.value })}
                        placeholder="Hasło"
                    />
                    <input
                        value={studentData.FieldOfStudy}
                        onChange={e => setStudentData({ ...studentData, FieldOfStudy: e.target.value })}
                        placeholder="Kierunek studiów"
                    />
                    {errors.FieldOfStudy && <p className="error">{errors.FieldOfStudy}</p>}
                    <input
                        type="number"
                        value={studentData.YearNumber}
                        onChange={e => setStudentData({ ...studentData, YearNumber: e.target.value })}
                        placeholder="Rok studiów"
                    />
                    {errors.YearNumber && <p className="error">{errors.YearNumber}</p>}
                    <input
                        type="number"
                        value={studentData.Semester}
                        onChange={e => setStudentData({ ...studentData, Semester: e.target.value })}
                        placeholder="Semestr"
                    />
                    {errors.Semester && <p className="error">{errors.Semester}</p>}
                    <h1>Posiadasz już konto? <a href="https://twojadomena.com/logowanie">Zaloguj się</a></h1>
                    <button type="submit">Zarejestruj się</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;