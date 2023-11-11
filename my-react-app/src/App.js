import './App.css';
import LoginForm from './components/LoginForm.js';
import RegistrationForm from './components/RegistrationForm.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* inne ścieżki */}
      </Routes>
    </Router>
  );
}

export default App;

