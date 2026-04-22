import { AppError } from '../errors/app-error.js';

export const validate = (schema) => (request, _response, next) => {
  const result = schema.safeParse({
    body: request.body,
    params: request.params,
    query: request.query
  });

  if (!result.success) {
    return next(new AppError('Validation failed', 400, result.error.flatten()));
  }

  request.body = result.data.body;
  request.params = result.data.params;
  request.query = result.data.query;

  return next();
};
