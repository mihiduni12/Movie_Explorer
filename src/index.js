import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

// Provider order: theme -> auth -> movie data -> router-aware app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
