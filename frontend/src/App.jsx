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