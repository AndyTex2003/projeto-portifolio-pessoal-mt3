import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    {
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      subject: user.id
    }
  );

  return { token };
};

export const authService = {
  login
};
