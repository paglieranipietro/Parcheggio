import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser({ ...userData, licensePlates: [] });
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await api.login(email, password);
      localStorage.setItem('token', authData.access_token);
      
      const userData = await api.getMe();
      setUser({
        ...userData,
        licensePlates: [],
        phone: '',
        birthDate: ''
      });
      setError(null);
      return userData.ruolo;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const register = async (userData) => {
    try {
      await api.register(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addLicensePlate = (plate) => {
    setUser(prev => ({
      ...prev,
      licensePlates: [...prev.licensePlates, { id: Date.now(), plate: plate.toUpperCase(), isSelected: prev.licensePlates.length === 0 }]
    }));
  };

  const selectLicensePlate = (plateId) => {
    setUser(prev => ({
      ...prev,
      licensePlates: prev.licensePlates.map(p => ({ ...p, isSelected: p.id === plateId }))
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, error, loading, login, logout, register, addLicensePlate, selectLicensePlate 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);