// API base URL configuration.
// - VITE_API_URL env var overrides everything (use for external backend like Render.com)
// - On production (Netlify): use relative /api path — routed to Netlify Functions
// - On local dev: use localhost:5000
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
    ? '/api'
    : 'http://localhost:5000/api');
