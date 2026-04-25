import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/app-error.js';

const list = async () => {
  return prisma.lesson.findMany({
    orderBy: {
      date: 'desc'
    }
  });
};

const findById = async (lessonId) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId
    }
  });

  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  return lesson;
};

const create = async (data) => {
  return prisma.lesson.create({
    data
  });
};

const update = async (lessonId, data) => {
  await findById(lessonId);

  return prisma.lesson.update({
    where: {
      id: lessonId
    },
    data
  });
};

const remove = async (lessonId) => {
  await findById(lessonId);

  await prisma.lesson.delete({
    where: {
      id: lessonId
    }
  });
};

export const lessonService = {
  create,
  findById,
  list,
  remove,
  update
};
