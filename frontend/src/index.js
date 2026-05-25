import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
  UserPreferencesProvider,
} from './context/UserPreferencesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserPreferencesProvider>
          <App />
        </UserPreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);