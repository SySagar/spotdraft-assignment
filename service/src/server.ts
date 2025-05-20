import app from './app';
import { logger } from '@config/logger'
const PORT = process.env.PORT ?? 5000;

try {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  logger.error('Failed to start server:', err);
}