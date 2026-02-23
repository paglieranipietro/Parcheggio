import { useState } from 'react';

const RegisterForm = ({ onSubmit, error, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Box di Errore */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Nome Completo</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          placeholder="es. Mario Rossi"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="mario@bresciapark.it"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          placeholder="••••••••"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-2 w-full bg-lib-primary hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
      >
        {isLoading ? 'Creazione account in corso...' : 'Registrati'}
      </button>
    </form>
  );
};

export default RegisterForm;