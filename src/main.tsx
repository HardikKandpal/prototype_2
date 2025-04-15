import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Declare the ENV property on the Window interface
declare global {
  interface Window {
    ENV: {
      API_URL: string;
    };
  }
}

// Configure API URL for different environments
// This ensures the frontend knows where to find the backend
window.ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'https://hardik8588-real-estate.hf.space'
};

console.log('Using API URL:', window.ENV.API_URL);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
