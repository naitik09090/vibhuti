// Dynamic configuration for the backend API URL.
// When deploying to Netlify, set the environment variable VITE_API_URL to your hosted backend URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');
