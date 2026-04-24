import { AppError } from '../errors/app-error.js';

export const authorizeAdmin = (request, _response, next) => {
  if (!request.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (request.user.role !== 'ADMIN') {
    return next(new AppError('Forbidden', 403));
  }

  return next();
};
