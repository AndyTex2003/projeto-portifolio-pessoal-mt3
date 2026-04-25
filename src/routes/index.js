import { Router } from 'express';

import { authRoutes } from './auth.routes.js';
import { lessonRoutes } from './lesson.routes.js';
import { progressRoutes } from './progress.routes.js';
import { studentRoutes } from './student.routes.js';

const router = Router();

router.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/lessons', lessonRoutes);
router.use('/progress', progressRoutes);
router.use('/students', studentRoutes);

export { router };
