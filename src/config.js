// Dynamic configuration for the backend API URL.
// When deploying to Netlify, set the environment variable VITE_API_URL to your hosted backend URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
