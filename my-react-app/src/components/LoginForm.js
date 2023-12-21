import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function LoginForm() {
    const [loginData, setLoginData] = useState({
        AlbumNumber: '',
        Password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5007/api/Login', loginData);
            console.log(response.data);
            localStorage.setItem('token', response.data.Token); 
            setLoginSuccess(true);
            setTimeout(() => { 
                if (response.data.IsSuperUser === 'Yes') {
                    navigate('/admin');
                  } else {
                    navigate('/home');
                  }
            }, 1500); 
        } catch (err) {
            if (err.response) {
                if (err.response.data === 'Wprowadzono niepoprawne hasło.') {
                    setError('Wprowadzono niepoprawne hasło.');}
                if (err.response.data === 'Wprowadź poprawny numer albumu.') {
                    setError('Wprowadź poprawny numer albumu.');}
            }
            else {
                setError('Wystąpił błąd. Spróbuj ponownie później.');
            }
            console.error(err);
        }
    };

    return (
        <>
        {loginSuccess && 
            <div className={`success-message ${loginSuccess ? 'active' : ''}`}>
                Zalogowano Pomyślnie!
            </div>}
        <div className='PP'>
        <div className='container'>
            <div className="image-container">
                <img src='LeftImage2.png' alt="Opis obrazka" />
        </div>
        <div className="signup-side">
            <form onSubmit={handleSubmit} className="login-form">
                <h5>Zaloguj się na konto!</h5>
                <h4><em>"Oświata jest rodzajem ciągłego dialogu, a dialog jest jedną z najlepszych form nauczania."</em> ~ <b>Plato</b></h4>
                <div className="form-group">
                    <h3>Numer Albumu</h3>
                    <input
                        type="text"
                        name="AlbumNumber"
                        value={loginData.AlbumNumber}
                        onChange={handleInputChange}
                        placeholder="Wprowadź Numer Albumu"
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
                        placeholder="Wprowadź Hasło"
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <h1>Nie masz swojego konta? <a href="/">Zarejestruj się!</a></h1>
                <button type="submit" className="Registration">Zaloguj się</button>
            </form>
        </div>
        </div>
        </div>
        </>
    );
}

export default LoginForm;