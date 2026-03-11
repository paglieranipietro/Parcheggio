import React, { createContext, useState, useContext } from 'react';
import { loginRequest, registerRequest } from '../services/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await loginRequest(email, password);
      if (response.data) {
        // Aggiungiamo campi di default per la gestione del profilo se non esistono
        const userData = {
          ...response.data,
          licensePlates: response.data.licensePlates || [],
          phone: response.data.phone || '',
          birthDate: response.data.birthDate || ''
        };
        setUser(userData);
        setError(null);
        return response.data.role;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerRequest(name, email, password);
      if (response.data) {
        const userData = {
          ...response.data,
          licensePlates: []
        };
        setUser(userData);
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

  // --- LOGICA ORIGINALE DELLE TARGHE E PROFILO ---
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
          isSelected: prevUser.licensePlates.length === 0
        }
      ]
    }));
  };

  const removeLicensePlate = (plateId) => {
    setUser(prevUser => {
      const updatedPlates = prevUser.licensePlates.filter(p => p.id !== plateId);
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
    <AuthContext.Provider value={{
      user, error, login, logout, register,
      updateUser, addLicensePlate, removeLicensePlate, selectLicensePlate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);