// Single Vercel serverless entry point.
// Re-exports the full Express app so all routes are handled by one function,
// keeping the deployment within Vercel Hobby plan's 12-function limit.
import app from '../src/app.js';

export default app;

