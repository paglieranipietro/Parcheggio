import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
 
const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error } = useAuth();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = await login(email, password);
    if (role) {
      onLoginSuccess(role);
    }
  };
 
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
 
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-lib-primary">Accedi al Portale Brescia Green</h3>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
     
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-200">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-lib-border rounded px-3 py-2 bg-lib-secondary text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lib-primary"
        />
      </div>
 
      <div className="flex flex-col relative">
        <label className="mb-1 font-medium text-gray-200">Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-lib-border rounded px-3 py-2 bg-lib-secondary text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lib-primary pr-10"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-9 text-sm text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          {showPassword ? 'Nascondi' : 'Mostra'}
        </button>
      </div>
 
      <button type="submit" className="w-full bg-lib-primary text-white py-2 rounded hover:bg-opacity-90 transition">Entra</button>
    </form>
  );
};
 
export default LoginForm;