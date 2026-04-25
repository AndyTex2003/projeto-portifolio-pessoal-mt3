import { progressService } from '../services/progress.service.js';

const list = async (request, response) => {
  const progresses = await progressService.list();

  return response.status(200).json(progresses);
};

const findById = async (request, response) => {
  const progress = await progressService.findById(request.params.id);

  return response.status(200).json(progress);
};

const create = async (request, response) => {
  const progress = await progressService.create(request.body);

  return response.status(201).json(progress);
};

export const progressController = {
  create,
  findById,
  list
};
