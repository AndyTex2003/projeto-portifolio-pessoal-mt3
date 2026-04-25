import { lessonService } from '../services/lesson.service.js';

const list = async (request, response) => {
  const lessons = await lessonService.list();

  return response.status(200).json(lessons);
};

const findById = async (request, response) => {
  const lesson = await lessonService.findById(request.params.id);

  return response.status(200).json(lesson);
};

const create = async (request, response) => {
  const lesson = await lessonService.create(request.body);

  return response.status(201).json(lesson);
};

const update = async (request, response) => {
  const lesson = await lessonService.update(request.params.id, request.body);

  return response.status(200).json(lesson);
};

const remove = async (request, response) => {
  await lessonService.remove(request.params.id);

  return response.status(204).send();
};

export const lessonController = {
  create,
  findById,
  list,
  remove,
  update
};
