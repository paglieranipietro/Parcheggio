import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { mockApi } from '../../services/mockApi';

const Register = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-lib-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl bg-lib-card border border-lib-border rounded-2xl p-6">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold text-white mb-2">
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