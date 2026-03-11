import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
 
const Login = () => {
  const navigate = useNavigate();
 
  const handleRedirect = (role) => {
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
      </div>
    </div>
  );
};
 
export default Login;