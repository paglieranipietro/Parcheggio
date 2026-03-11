import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Nota come qui usiamo "./" (punto singolo) perché App.jsx e la cartella "pages" 
// sono allo stesso livello dentro "src"
import Register from '../pages/Register'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mostra il Register come pagina iniziale per farti testare la grafica */}
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;