import serverless from 'serverless-http';
import app from '../../server/server.js';

// Wrap the entire Express app as a Netlify serverless function
export const handler = serverless(app);
