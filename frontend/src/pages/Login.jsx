import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleRedirect = (role) => {
    // In base a come avete impostato App.jsx:
    // Se usate la rotta unificata che avevamo fatto prima, basta: navigate('/dashboard');
    // Altrimenti mantieni queste due separate come avevi scritto tu:
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lib-secondary relative">
      {/* Bottone tema - top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-3 py-2 bg-lib-primary text-white rounded-md hover:opacity-90 transition-opacity font-medium text-sm flex items-center gap-2"
        title={isDark ? 'Passa a modalità chiara' : 'Passa a modalità scura'}
      >
        {isDark ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.657 5.657l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div className="max-w-md w-full bg-lib-card p-8 rounded-lg shadow-lg border border-lib-border">
        <h1 className="text-2xl font-bold mb-2 text-lib-primary text-center">Benvenuto in Brescia Parking</h1>
        <p className="text-gray-300 mb-6 text-center">Ottimizza il tuo percorso, riduci le emissioni.</p>

        <LoginForm onLoginSuccess={handleRedirect} />

        {/* SEZIONE AGGIUNTA: Link alla registrazione con stile "lib" */}
        <div className="mt-6 text-center border-t border-lib-border pt-4">
          <p className="text-sm text-gray-300">
            Non hai un account?{' '}
            <Link to="/register" className="font-bold text-lib-primary hover:text-opacity-80 transition-opacity">
              Registrati ora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;