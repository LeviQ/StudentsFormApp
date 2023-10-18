import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
    const [studentData, setStudentData] = useState({
        AlbumNumber: '',
        StudentPasswordHash: '',  // Sugeruję zastosowanie nazwy 'Password' zamiast 'StudentPasswordHash', ale to zależy od Twojego backendu
        FieldOfStudy: '',
        YearNumber: '',           // Zmieniłem wartość początkową na pusty ciąg, zamiast 0
        Semester: ''              // Podobnie jak wyżej
    });

    const handleSubmit = (event) => {
        event.preventDefault();

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
        <form onSubmit={handleSubmit}>
            <input 
                value={studentData.AlbumNumber}
                onChange={e => setStudentData({ ...studentData, AlbumNumber: e.target.value })}
                placeholder="Numer albumu"
            />
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
            <input
                type="number"
                value={studentData.YearNumber}
                onChange={e => setStudentData({ ...studentData, YearNumber: e.target.value })}
                placeholder="Rok studiów"
            />
            <input
                type="number"
                value={studentData.Semester}
                onChange={e => setStudentData({ ...studentData, Semester: e.target.value })}
                placeholder="Semestr"
            />
            <button type="submit">Zarejestruj</button>
        </form>
    );
}

export default RegistrationForm;