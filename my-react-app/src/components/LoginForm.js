import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css'; // Załóżmy, że masz już odpowiednie style CSS

function LoginForm() {
    const [loginData, setLoginData] = useState({
        AlbumNumber: '',
        Password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5007/api/Login', loginData);
            console.log(response.data);
            // Zapisz token w localStorage lub w stanie globalnym aplikacji
            localStorage.setItem('token', response.data.token); // Przykładowe zapisanie tokenu
            // Przekieruj na stronę główną lub dashboard
            navigate('/home'); // Przykładowa ścieżka do strony głównej
        } catch (err) {
            setError('Nieudane logowanie. Spróbuj ponownie.');
            console.error(err);
        }
    };

    return (
        <div className='container'>
            <div className="image-container">
                <img src='LeftImage2.png' alt="Opis obrazka" />
            </div>
        <div className="signup-side">
            <form onSubmit={handleSubmit} className="login-form">
                <h5>Zaloguj się na konto!</h5>
                <h4><em>"Oświata jest rodzajem ciągłego dialogu, a dialog jest jedną z najlepszych form nauczania."</em> ~ <b>Plato</b></h4>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <h3>Numer Albumu</h3>
                    <input
                        type="text"
                        name="AlbumNumber"
                        value={loginData.AlbumNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <h3>Hasło</h3>
                    <input
                        type="password"
                        name="Password"
                        value={loginData.Password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <h1>Nie masz swojego konta? <a href="/">Zarejestruj się!</a></h1>
                <button type="submit" className="login-button">Zaloguj się</button>
            </form>
        </div>
        </div>
    );
}

export default LoginForm;