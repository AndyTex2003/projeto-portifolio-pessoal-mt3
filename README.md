# 🚀 API Escola - Backend com Node.js, Prisma e Testes de Integração

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Tests](https://img.shields.io/badge/tests-29%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-integration%20tested-blue)
![Status](https://img.shields.io/badge/status-production--ready-success)

---

## 🧠 Sobre o projeto

API REST desenvolvida para gerenciamento de alunos de uma escola de inglês.

O projeto foi construído com foco em **boas práticas de backend e qualidade de software**, incluindo autenticação, validação, testes automatizados e documentação.

---

## ⭐ Diferenciais

🔐 Autenticação com JWT
🧪 Testes de integração com Vitest e Supertest
🗄️ Banco de dados PostgreSQL com Docker
⚙️ ORM Prisma
📄 Documentação interativa com Swagger
✅ Validação robusta com Zod
🧱 Arquitetura organizada (controllers, services, validators)
📊 Gestão ágil com GitHub Projects
📚 Documentação QA (Wiki + BDD + Test Cases)

---

## 🛠️ Tecnologias utilizadas

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Docker
* JWT (JSON Web Token)
* Zod
* Vitest + Supertest
* Swagger (OpenAPI)

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/AndyTex2003/projeto-portifolio-pessoal-mt3.git
cd projeto-portifolio-pessoal-mt3
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Subir o banco com Docker

```bash
docker start postgres-db
```

### 4. Rodar migrations

```bash
npx prisma migrate deploy
```

### 5. Rodar seed

```bash
npm run prisma:seed
```

### 6. Iniciar a API

```bash
npm run dev
```

---

## 🔐 Autenticação

Usuário padrão para testes:

```json
{
  "email": "admin@escola.com",
  "password": "admin123"
}
```

---

## 📄 Documentação da API

Acesse via navegador:

👉 http://localhost:3000/api-docs

---

## 🧪 Testes

Rodar testes de integração:

```bash
npm test
```

### ✔ Cobertura

* Sucesso (200 / 201)
* Validação (400)
* Autenticação (401)
* Não encontrado (404)

---

## 🧪 Relatório de Testes

### 📊 Resumo

![Resumo dos testes](docs/test-summary.png)

### 📈 Detalhes

![Detalhes dos testes](docs/test-progress.png)

---

## 📊 Gestão do Projeto (Kanban)

Board com User Stories e fluxo ágil:

👉 https://github.com/AndyTex2003/projeto-portifolio-pessoal-mt3/projects

---

## 📚 Documentação QA

Casos de teste, estratégia e BDD:

👉 https://github.com/AndyTex2003/projeto-portifolio-pessoal-mt3/wiki

---

## 📌 Estrutura do projeto

```
src/
  controllers/
  services/
  routes/
  middlewares/
  validators/
  config/

prisma/
tests/
docs/
```

---

## 🚀 Endpoints principais

### Auth

POST /api/auth/login

### Students

GET /api/students
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id

### Lessons

GET /api/lessons
POST /api/lessons

### Progress

GET /api/progress
POST /api/progress

---

## 🧪 Qualidade

A API foi desenvolvida com foco em confiabilidade:

* Testes de integração isolados
* Dados independentes por teste
* Limpeza automática com Prisma
* Validação com Zod
* Regras de negócio testadas (evolução de nível)

---

## 🎯 Objetivo

Este projeto demonstra:

* Desenvolvimento backend com Node.js
* Testes automatizados de API
* Integração com banco de dados
* Boas práticas de arquitetura
* Organização QA (Test Strategy, Test Cases, BDD)
* Gestão ágil com Kanban

---

## 👨‍💻 Autor

**Anderson Santos**
🔗 https://www.linkedin.com/in/anderson-santos-qa/
