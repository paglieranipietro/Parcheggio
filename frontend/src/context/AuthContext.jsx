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
      {children}
    </AuthContext.Provider>
  );
};
