import { studentService } from '../services/student.service.js';

const list = async (request, response) => {
  const students = await studentService.list();

  return response.status(200).json(students);
};

const findById = async (request, response) => {
  const student = await studentService.findById(request.params.id);

  return response.status(200).json(student);
};

const create = async (request, response) => {
  const student = await studentService.create(request.body);

  return response.status(201).json(student);
};

const update = async (request, response) => {
  const student = await studentService.update(request.params.id, request.body);

  return response.status(200).json(student);
};

const remove = async (request, response) => {
  await studentService.remove(request.params.id);

  return response.status(204).send();
};

export const studentController = {
  create,
  findById,
  list,
  remove,
  update
};
