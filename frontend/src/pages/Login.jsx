import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  /**
   * Reindirizza l'utente alla dashboard (il routing basato su ruolo avviene in App.jsx).
   */
  const handleRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lib-secondary">
      <div className="max-w-md w-full bg-lib-card p-8 rounded-lg shadow-lg border border-lib-border">
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center font-medium shadow-sm">
            {successMessage}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2 text-lib-primary text-center">Benvenuto in Brescia Parking</h1>
        <p className="text-gray-300 mb-6 text-center">Ottimizza il tuo percorso, riduci le emissioni.</p>

        <LoginForm onLoginSuccess={handleRedirect} />

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