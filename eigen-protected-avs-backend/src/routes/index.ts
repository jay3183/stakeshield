import { Application } from 'express';
import operatorsRouter from './operators';

export function setupRoutes(app: Application) {
  app.use('/api/operators', operatorsRouter);
} 