import { Router } from 'express';

import { progressController } from '../controllers/progress.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorizeAdmin } from '../middlewares/authorize-admin.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createProgressSchema,
  progressIdParamSchema
} from '../validators/progress.validator.js';

const progressRoutes = Router();

/**
 * @openapi
 * /api/progress:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Lista os registros de progresso
 *     responses:
 *       200:
 *         description: Lista de progresso retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Progress'
 */
progressRoutes.get('/', asyncHandler(progressController.list));

/**
 * @openapi
 * /api/progress/{id}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Busca um progresso por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do progresso
 *     responses:
 *       200:
 *         description: Progresso encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 *       400:
 *         description: Requisicao invalida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Progresso nao encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
progressRoutes.get('/:id', validate(progressIdParamSchema), asyncHandler(progressController.findById));

/**
 * @openapi
 * /api/progress:
 *   post:
 *     tags:
 *       - Progress
 *     summary: Cria um novo registro de progresso
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgressInput'
 *     responses:
 *       201:
 *         description: Progresso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
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
 *         description: Aluno ou aula nao encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
progressRoutes.post(
  '/',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(createProgressSchema),
  asyncHandler(progressController.create)
);

export { progressRoutes };
