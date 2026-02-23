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
  });

  const updateUser = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
