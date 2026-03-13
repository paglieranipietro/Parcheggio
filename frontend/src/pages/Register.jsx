import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import RegisterForm from '../../components/auth/RegisterForm';
import { mockApi } from '../../services/mockApi';

const Register = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleRegister = async (userData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Registrazione in corso...');
      await mockApi.register(userData);
      alert("Account Green creato con successo! 🌱");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lib-dark flex flex-col justify-center items-center p-4 relative">
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

      <div className="w-full max-w-xl bg-lib-card border border-lib-border rounded-2xl p-6">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold mb-2 text-lib-primary">
            Unisciti a noi
          </h2>
          <p className="text-gray-400 text-sm">
            Crea il tuo account per accedere alla nostra app Parcheggio
          </p>
        </div>

        <RegisterForm onSubmit={handleRegister} error={error} isLoading={isLoading} />

        <div className="mt-4 text-center text-sm text-gray-400">
          Hai già un account?{' '}
          <Link to="/login" className="text-lib-primary hover:text-purple-400 font-medium transition-colors">
            Accedi qui
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;