import app from './app';
const PORT = process.env.PORT ?? 5000;

try {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
}