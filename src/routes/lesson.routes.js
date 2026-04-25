import { Router } from 'express';

import { lessonController } from '../controllers/lesson.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorizeAdmin } from '../middlewares/authorize-admin.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createLessonSchema,
  lessonIdParamSchema,
  updateLessonSchema
} from '../validators/lesson.validator.js';

const lessonRoutes = Router();

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Lista as aulas
 *     responses:
 *       200:
 *         description: Lista de aulas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRoutes.get('/', asyncHandler(lessonController.list));

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Busca uma aula por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       200:
 *         description: Aula encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Requisicao invalida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Aula nao encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lessonRoutes.get('/:id', validate(lessonIdParamSchema), asyncHandler(lessonController.findById));

/**
 * @openapi
 * /api/lessons:
 *   post:
 *     tags:
 *       - Lessons
 *     summary: Cria uma nova aula
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonInput'
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente ou invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lessonRoutes.post(
  '/',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(createLessonSchema),
  asyncHandler(lessonController.create)
);

/**
 * @openapi
 * /api/lessons/{id}:
 *   put:
 *     tags:
 *       - Lessons
 *     summary: Atualiza uma aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonUpdateInput'
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente ou invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Aula nao encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lessonRoutes.put(
  '/:id',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(updateLessonSchema),
  asyncHandler(lessonController.update)
);

/**
 * @openapi
 * /api/lessons/{id}:
 *   delete:
 *     tags:
 *       - Lessons
 *     summary: Remove uma aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       204:
 *         description: Aula removida com sucesso
 *       400:
 *         description: Requisicao invalida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente ou invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Aula nao encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lessonRoutes.delete(
  '/:id',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(lessonIdParamSchema),
  asyncHandler(lessonController.remove)
);

export { lessonRoutes };
