import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Marco',
    surname: 'Rossi',
    username: 'marcorossi89',
    password: 'SecurePass123!',
    email: 'marcorossi@gmail.com',
    phone: '+39 328 4756932',
    birthDate: '1989-07-23',
    licensePlates: [],
  });

  const updateUser = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  const addLicensePlate = (plate) => {
    setUser(prevUser => ({
      ...prevUser,
      licensePlates: [
        ...prevUser.licensePlates,
        {
          id: Date.now(),
          plate: plate.toUpperCase(),
          isSelected: prevUser.licensePlates.length === 0 // La prima targa è automaticamente selezionata
        }
      ]
    }));
  };

  const removeLicensePlate = (plateId) => {
    setUser(prevUser => {
      const updatedPlates = prevUser.licensePlates.filter(p => p.id !== plateId);
      // Se la targa rimossa era selezionata e ci sono altre targhe, seleziona la prima
      if (updatedPlates.length > 0 && !updatedPlates.some(p => p.isSelected)) {
        updatedPlates[0].isSelected = true;
      }
      return {
        ...prevUser,
        licensePlates: updatedPlates
      };
    });
  };

  const selectLicensePlate = (plateId) => {
    setUser(prevUser => ({
      ...prevUser,
      licensePlates: prevUser.licensePlates.map(p => ({
        ...p,
        isSelected: p.id === plateId
      }))
    }));
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, addLicensePlate, removeLicensePlate, selectLicensePlate }}>
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
