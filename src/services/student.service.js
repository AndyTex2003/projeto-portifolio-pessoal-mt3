import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/app-error.js';

const list = async () => {
  return prisma.student.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const findById = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    }
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

const create = async (data) => {
  const existingStudent = await prisma.student.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingStudent) {
    throw new AppError('A student with this email already exists', 409);
  }

  return prisma.student.create({
    data
  });
};

const update = async (studentId, data) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    }
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  if (data.email && data.email !== student.email) {
    const studentWithEmail = await prisma.student.findUnique({
      where: {
        email: data.email
      }
    });

    if (studentWithEmail) {
      throw new AppError('A student with this email already exists', 409);
    }
  }

  return prisma.student.update({
    where: {
      id: studentId
    },
    data
  });
};

const remove = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    }
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  await prisma.student.delete({
    where: {
      id: studentId
    }
  });
};

export const studentService = {
  create,
  findById,
  list,
  remove,
  update
};
