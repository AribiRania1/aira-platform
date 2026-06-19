import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check local storage or default to system preference
    const savedTheme = localStorage.getItem('aira_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aira_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
