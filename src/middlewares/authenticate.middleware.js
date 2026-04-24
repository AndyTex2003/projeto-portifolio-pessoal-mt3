import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/app-error.js';

export const authenticate = async (request, _response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return next(new AppError('Authentication required', 401));
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return next(new AppError('Authentication required', 401));
    }

    request.user = user;

    return next();
  } catch (_error) {
    return next(new AppError('Authentication required', 401));
  }
};
