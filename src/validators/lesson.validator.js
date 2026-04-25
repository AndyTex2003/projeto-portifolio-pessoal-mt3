import { z } from 'zod';

const lessonIdParamSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().cuid('Invalid lesson id')
  }),
  query: z.object({}).default({})
});

const lessonBaseBodySchema = z.object({
  date: z.coerce.date(),
  content: z.string().trim().min(5).max(1000),
  notes: z.string().trim().max(255).optional()
});

const createLessonSchema = z.object({
  body: lessonBaseBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

const updateLessonSchema = z.object({
  body: lessonBaseBodySchema.partial().refine(
    (payload) => Object.keys(payload).length > 0,
    'At least one field must be informed'
  ),
  params: z.object({
    id: z.string().cuid('Invalid lesson id')
  }),
  query: z.object({}).default({})
});

export {
  createLessonSchema,
  lessonIdParamSchema,
  updateLessonSchema
};
