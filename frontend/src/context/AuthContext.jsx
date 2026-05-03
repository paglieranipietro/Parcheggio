import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carica i dati completi dell'utente includendo profilo e targhe associate.
   * @returns {Promise<Object>} Dati utente completi con array di targhe formattato
   */
  const fetchFullUserData = async () => {
    const userData = await api.getMe();
    
    // Scarica anche le targhe vere dal DB
    let formattedPlates = [];
    try {
      const platesData = await api.getLicensePlates();
      // Trasformiamo i nomi delle colonne DB in quelli che si aspetta React
      formattedPlates = (platesData || []).map(p => ({
        id: p.id_targa,
        plate: p.targa,
        isSelected: p.selezionata === 'S'
      }));
    } catch (e) {
      console.warn("Errore nel caricamento targhe", e);
    }

    return {
      ...userData,
      name: userData.nome, 
      surname: userData.cognome,
      phone: userData.telefono || '',
      birthDate: userData.data_nascita || '',
      licensePlates: formattedPlates // Ora le targhe sono sempre un array!
    };
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const fullUserData = await fetchFullUserData();
          setUser(fullUserData);
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
      
      const fullUserData = await fetchFullUserData();
      setUser(fullUserData);
      setError(null);
      return fullUserData.ruolo; // 'admin' o 'utente'
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

  const updateUser = async (updatedFields) => {
    try {
      const newUserData = { ...user, ...updatedFields };
      await api.updateProfile(newUserData);
      setUser(newUserData);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // ==========================================
  // FUNZIONI TARGHE COLLEGATE AL DATABASE VERO
  // ==========================================

  const addLicensePlate = async (plate) => {
    try {
      // 1. Salva nel DB tramite API
      const newPlateDb = await api.addLicensePlate(plate);
      
      // 2. Aggiorna lo stato di React (convertendo i nomi dal DB)
      setUser(prev => ({
        ...prev,
        licensePlates: [...(prev.licensePlates || []), {
          id: newPlateDb.id_targa,
          plate: newPlateDb.targa,
          isSelected: newPlateDb.selezionata === 'S'
        }]
      }));
    } catch (err) {
      console.error("Errore salvataggio targa:", err);
      throw err; // Rilancia l'errore per farlo vedere all'utente
    }
  };

  const removeLicensePlate = async (plateId) => {
    try {
      await api.deleteLicensePlate(plateId);
      setUser(prev => ({
        ...prev,
        licensePlates: (prev.licensePlates || []).filter(p => p.id !== plateId)
      }));
    } catch (err) {
      console.error("Errore cancellazione targa:", err);
    }
  };

  const selectLicensePlate = async (plateId) => {
    try {
      await api.selectLicensePlate(plateId);
      setUser(prev => ({
        ...prev,
        licensePlates: (prev.licensePlates || []).map(p => ({
          ...p,
          isSelected: p.id === plateId
        }))
      }));
    } catch (err) {
      console.error("Errore selezione targa:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, error, loading, login, logout, register, updateUser,
      addLicensePlate, removeLicensePlate, selectLicensePlate // <- Eccoli qui! Ora ci sono tutti.
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);