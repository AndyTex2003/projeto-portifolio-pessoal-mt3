import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { loginSchema } from '../validators/auth.validator.js';

const authRoutes = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza login do usuario
 *     description: Autentica um usuario e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais invalidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.post('/login', validate(loginSchema), asyncHandler(authController.login));

export { authRoutes };
