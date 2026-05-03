import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    /**
     * Verifica se l'utente ha una preferenza di tema salvata in localStorage.
     * Impostazione predefinita: dark mode.
     */
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true; // Default: dark mode
  });

  useEffect(() => {
    // Salva la preferenza in localStorage
    localStorage.setItem('theme', JSON.stringify(isDark));
    
    // Applica il tema al documento
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
