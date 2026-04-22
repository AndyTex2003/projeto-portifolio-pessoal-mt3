import { Router } from 'express';

import { studentController } from '../controllers/student.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createStudentSchema,
  studentIdParamSchema,
  updateStudentSchema
} from '../validators/student.validator.js';

const studentRoutes = Router();

studentRoutes.get('/', asyncHandler(studentController.list));
studentRoutes.get('/:id', validate(studentIdParamSchema), asyncHandler(studentController.findById));
studentRoutes.post('/', validate(createStudentSchema), asyncHandler(studentController.create));
studentRoutes.put(
  '/:id',
  validate(updateStudentSchema),
  asyncHandler(studentController.update)
);
studentRoutes.delete(
  '/:id',
  validate(studentIdParamSchema),
  asyncHandler(studentController.remove)
);

export { studentRoutes };
