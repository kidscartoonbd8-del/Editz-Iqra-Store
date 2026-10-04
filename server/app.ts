import express from 'express';
import { apiRouter } from './api.ts';

export const app = express();

// Mount API routes under /api
app.use('/api', apiRouter);
