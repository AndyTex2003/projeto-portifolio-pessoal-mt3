import { authService } from '../services/auth.service.js';

const login = async (request, response) => {
  const result = await authService.login(request.body);

  return response.status(200).json(result);
};

export const authController = {
  login
};
