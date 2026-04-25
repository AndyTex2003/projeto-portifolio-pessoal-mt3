import { z } from 'zod';

const progressIdParamSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().cuid('Invalid progress id')
  }),
  query: z.object({}).default({})
});

const createProgressSchema = z.object({
  body: z.object({
    studentId: z.string().cuid('Invalid student id'),
    lessonId: z.string().cuid('Invalid lesson id'),
    grade: z.number().min(0).max(100),
    present: z.boolean(),
    comment: z.string().trim().max(255).optional()
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export {
  createProgressSchema,
  progressIdParamSchema
};
