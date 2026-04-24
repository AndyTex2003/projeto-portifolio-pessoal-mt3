import { Router } from 'express';

import { studentController } from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorizeAdmin } from '../middlewares/authorize-admin.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createStudentSchema,
  studentIdParamSchema,
  updateStudentSchema
} from '../validators/student.validator.js';

const studentRoutes = Router();

/**
 * @openapi
 * /api/students:
 *   get:
 *     tags:
 *       - Students
 *     summary: Lista os alunos
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       400:
 *         description: Requisicao invalida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Nao autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
studentRoutes.get('/', asyncHandler(studentController.list));
studentRoutes.get('/:id', validate(studentIdParamSchema), asyncHandler(studentController.findById));

/**
 * @openapi
 * /api/students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Cria um novo aluno
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
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
studentRoutes.post(
  '/',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(createStudentSchema),
  asyncHandler(studentController.create)
);

/**
 * @openapi
 * /api/students/{id}:
 *   put:
 *     tags:
 *       - Students
 *     summary: Atualiza um aluno existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentUpdateInput'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
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
studentRoutes.put(
  '/:id',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(updateStudentSchema),
  asyncHandler(studentController.update)
);

/**
 * @openapi
 * /api/students/{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Remove um aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       204:
 *         description: Aluno removido com sucesso
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
 */
studentRoutes.delete(
  '/:id',
  asyncHandler(authenticate),
  authorizeAdmin,
  validate(studentIdParamSchema),
  asyncHandler(studentController.remove)
);

export { studentRoutes };
