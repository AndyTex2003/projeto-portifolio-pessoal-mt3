import { Router } from 'express';

import { authRoutes } from './auth.routes.js';
import { studentRoutes } from './student.routes.js';

const router = Router();

router.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);

export { router };
