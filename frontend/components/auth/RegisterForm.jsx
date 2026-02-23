import { useState } from 'react';

const RegisterForm = ({ onSubmit, error, isLoading }) => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataNascita, setDataNascita] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome, cognome, username, password, dataNascita, email, telefono });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Box di Errore */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Nome</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          placeholder="es. Mario"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Cognome</label>
        <input 
          type="text" 
          value={cognome} 
          onChange={(e) => setCognome(e.target.value)} 
          required 
          placeholder="es. Rossi"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Nome Utente</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          placeholder="es. mario.rossi"
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-400">Data di Nascita</label>
        <input 
          type="date" 
          value={dataNascita} 
          onChange={(e) => setDataNascita(e.target.value)} 
          required 
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
        <label className="text-sm font-medium text-gray-400">Numero di Telefono</label>
        <input 
          type="tel" 
          value={telefono} 
          onChange={(e) => setTelefono(e.target.value)} 
          required 
          placeholder="es. +39 320 1234567"
          className="bg-lib-secondary border border-lib-border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-lib-primary focus:ring-1 focus:ring-lib-primary transition-all duration-200"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-2 w-full bg-lib-primary hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creazione account in corso...' : 'Registrati'}
      </button>
    </form>
  );
};

export default RegisterForm;