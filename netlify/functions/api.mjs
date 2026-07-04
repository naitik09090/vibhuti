import serverless from 'serverless-http';
import app from '../../server/server.js';

const serverlessHandler = serverless(app);

// Wrap the entire Express app as a Netlify serverless function
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await serverlessHandler(event, context);
};
