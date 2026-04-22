import { Router } from 'express';

import { studentRoutes } from './student.routes.js';

const router = Router();

router.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' });
});

router.use('/students', studentRoutes);

export { router };

