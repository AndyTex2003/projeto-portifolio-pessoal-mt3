import { z } from 'zod';

const studentIdParamSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().cuid('Invalid student id')
  }),
  query: z.object({}).default({})
});

const studentBaseBodySchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20).optional(),
  currentLevel: z.enum(['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'FLUENT']),
  birthDate: z.coerce.date().optional(),
  notes: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
  enrollmentDate: z.coerce.date().optional()
});

const createStudentSchema = z.object({
  body: studentBaseBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

const updateStudentSchema = z.object({
  body: studentBaseBodySchema.partial().refine(
    (payload) => Object.keys(payload).length > 0,
    'At least one field must be informed'
  ),
  params: z.object({
    id: z.string().cuid('Invalid student id')
  }),
  query: z.object({}).default({})
});

export {
  createStudentSchema,
  studentIdParamSchema,
  updateStudentSchema
};

