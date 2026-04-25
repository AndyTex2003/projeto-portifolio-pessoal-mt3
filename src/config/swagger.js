import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'English School API',
      version: '1.0.0',
      description: 'Documentacao da API de autenticacao e gerenciamento de alunos.'
    },

    tags: [
      {
        name: 'Auth',
        description: 'Autenticação'
      },
      {
        name: 'Students',
        description: 'Gerenciamento de alunos'
      },
      {
        name: 'Lessons',
        description: 'Gerenciamento de aulas'
      },
      {
        name: 'Progress',
        description: 'Progresso dos alunos'
      }
    ],

    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@escola.com'
            },
            password: {
              type: 'string',
              example: 'admin123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example'
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def456'
            },
            fullName: {
              type: 'string',
              example: 'Maria Oliveira'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria.oliveira@escola.com'
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '11999999999'
            },
            currentLevel: {
              type: 'string',
              enum: ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'FLUENT'],
              example: 'INTERMEDIATE'
            },
            birthDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2005-05-10T00:00:00.000Z'
            },
            notes: {
              type: 'string',
              nullable: true,
              example: 'Aluno focado em conversacao'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            enrollmentDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-23T00:00:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-23T20:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-23T20:00:00.000Z'
            }
          }
        },
        StudentInput: {
          type: 'object',
          required: ['fullName', 'email', 'currentLevel'],
          properties: {
            fullName: {
              type: 'string',
              minLength: 3,
              maxLength: 120,
              example: 'Maria Oliveira'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria.oliveira@escola.com'
            },
            phone: {
              type: 'string',
              minLength: 8,
              maxLength: 20,
              example: '11999999999'
            },
            currentLevel: {
              type: 'string',
              enum: ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'FLUENT'],
              example: 'INTERMEDIATE'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '2005-05-10'
            },
            notes: {
              type: 'string',
              maxLength: 500,
              example: 'Aluno focado em conversacao'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            enrollmentDate: {
              type: 'string',
              format: 'date',
              example: '2026-04-23'
            }
          }
        },
        StudentUpdateInput: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string',
              minLength: 3,
              maxLength: 120,
              example: 'Maria Oliveira Santos'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria.santos@escola.com'
            },
            phone: {
              type: 'string',
              minLength: 8,
              maxLength: 20,
              example: '11988888888'
            },
            currentLevel: {
              type: 'string',
              enum: ['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'FLUENT'],
              example: 'ADVANCED'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '2005-05-10'
            },
            notes: {
              type: 'string',
              maxLength: 500,
              example: 'Aluno atualizado'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            enrollmentDate: {
              type: 'string',
              format: 'date',
              example: '2026-04-23'
            }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def456'
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-24T19:00:00.000Z'
            },
            content: {
              type: 'string',
              example: 'Simple present e praticas de conversacao'
            },
            notes: {
              type: 'string',
              nullable: true,
              example: 'Aula com foco em revisao'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-24T20:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-24T20:00:00.000Z'
            }
          }
        },
        LessonInput: {
          type: 'object',
          required: ['date', 'content'],
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-24T19:00:00.000Z'
            },
            content: {
              type: 'string',
              minLength: 5,
              example: 'Simple present e praticas de conversacao'
            },
            notes: {
              type: 'string',
              maxLength: 255,
              example: 'Aula com foco em revisao'
            }
          }
        },
        LessonUpdateInput: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-25T19:00:00.000Z'
            },
            content: {
              type: 'string',
              minLength: 5,
              example: 'Past tense e exercicios guiados'
            },
            notes: {
              type: 'string',
              maxLength: 255,
              example: 'Aula remarcada'
            }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def456'
            },
            studentId: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def111'
            },
            lessonId: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def222'
            },
            grade: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              example: 85
            },
            present: {
              type: 'boolean',
              example: true
            },
            comment: {
              type: 'string',
              nullable: true,
              example: 'Excelente participacao'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-24T20:15:00.000Z'
            },
            student: {
              $ref: '#/components/schemas/Student'
            },
            lesson: {
              $ref: '#/components/schemas/Lesson'
            }
          }
        },
        ProgressInput: {
          type: 'object',
          required: ['studentId', 'lessonId', 'grade', 'present'],
          properties: {
            studentId: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def111'
            },
            lessonId: {
              type: 'string',
              example: 'cm9x8v3s50000abc123def222'
            },
            grade: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              example: 85
            },
            present: {
              type: 'boolean',
              example: true
            },
            comment: {
              type: 'string',
              maxLength: 255,
              example: 'Excelente participacao'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              nullable: true,
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: true
                },
                {
                  type: 'null'
                }
              ]
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec };
