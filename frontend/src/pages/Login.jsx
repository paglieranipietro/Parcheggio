import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-lib-secondary">
      <div className="max-w-md w-full bg-lib-card p-8 rounded-lg shadow-lg border border-lib-border">
        <h1 className="text-2xl font-bold mb-2 text-lib-primary">Benvenuto in Brescia Parking</h1>
        <p className="text-gray-300 mb-6">Ottimizza il tuo percorso, riduci le emissioni.</p>

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