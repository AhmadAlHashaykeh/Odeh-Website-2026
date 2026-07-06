import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PublicSiteProvider } from './context/PublicSiteContext';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PublicSiteProvider>
          <SmoothScrollProvider>
            <App />
          </SmoothScrollProvider>
        </PublicSiteProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
