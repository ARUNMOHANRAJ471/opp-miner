import app from './app.js';

const PORT = process.env.PORT || 3005;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://0.0.0.0:${PORT}`);
});
