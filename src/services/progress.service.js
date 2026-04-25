import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/app-error.js';

const LEVEL_SEQUENCE = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT'];

const getNextLevel = (currentLevel) => {
  if (currentLevel === 'ELEMENTARY') {
    return 'INTERMEDIATE';
  }

  const currentIndex = LEVEL_SEQUENCE.indexOf(currentLevel);

  if (currentIndex === -1 || currentIndex === LEVEL_SEQUENCE.length - 1) {
    return currentLevel;
  }

  return LEVEL_SEQUENCE[currentIndex + 1];
};

const ensureStudentExists = async (studentId, tx = prisma) => {
  const student = await tx.student.findUnique({
    where: {
      id: studentId
    }
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

const ensureLessonExists = async (lessonId, tx = prisma) => {
  const lesson = await tx.lesson.findUnique({
    where: {
      id: lessonId
    }
  });

  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  return lesson;
};

const list = async () => {
  return prisma.progress.findMany({
    include: {
      student: true,
      lesson: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const findById = async (progressId) => {
  const progress = await prisma.progress.findUnique({
    where: {
      id: progressId
    },
    include: {
      student: true,
      lesson: true
    }
  });

  if (!progress) {
    throw new AppError('Progress not found', 404);
  }

  return progress;
};

const recalculateStudentLevel = async (studentId, tx = prisma) => {
  const student = await ensureStudentExists(studentId, tx);
  const progresses = await tx.progress.findMany({
    where: {
      studentId
    },
    select: {
      grade: true,
      present: true
    }
  });

  if (progresses.length === 0) {
    return student;
  }

  const attendanceRate =
    progresses.filter((progress) => progress.present).length / progresses.length;
  const averageGrade =
    progresses.reduce((total, progress) => total + progress.grade, 0) / progresses.length;

  const shouldPromote = attendanceRate >= 0.65 && averageGrade >= 70;
  const nextLevel = shouldPromote ? getNextLevel(student.currentLevel) : student.currentLevel;

  if (nextLevel === student.currentLevel) {
    return student;
  }

  return tx.student.update({
    where: {
      id: studentId
    },
    data: {
      currentLevel: nextLevel
    }
  });
};

const create = async (data) => {
  return prisma.$transaction(async (tx) => {
    await ensureStudentExists(data.studentId, tx);
    await ensureLessonExists(data.lessonId, tx);

    const progress = await tx.progress.create({
      data,
      include: {
        student: true,
        lesson: true
      }
    });

    const updatedStudent = await recalculateStudentLevel(data.studentId, tx);

    return {
      ...progress,
      student: updatedStudent
    };
  });
};

export const progressService = {
  create,
  findById,
  list,
  recalculateStudentLevel
};
