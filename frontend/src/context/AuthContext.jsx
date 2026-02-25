import React, { createContext, useState, useContext } from 'react';
import { loginRequest, registerRequest } from '../services/mockApi';
 
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
 
  const login = async (email, password) => {
    try {
      const response = await loginRequest(email, password);
     
      // IL SEMPLICE "IF" DI VERIFICA RICHIESTO
      if (response.data) {
        setUser(response.data); // Salviamo l'utente (id, email, ruolo)
        setError(null);
        return response.data.role; // Ritorniamo il ruolo per il redirect
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };
 
  // opzione di registrazione finta
  const register = async (name, email, password) => {
    try {
      const response = await registerRequest(name, email, password);
      if (response.data) {
        setUser(response.data);
        setError(null);
        return response.data.role;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };
 
  const logout = () => {
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
};
 
// Hook personalizzato per usare il contesto velocemente
export const useAuth = () => useContext(AuthContext);