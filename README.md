# 🚀 Projeto Portfólio - API Escola

API REST desenvolvida para gerenciamento de alunos de uma escola de inglês, com autenticação JWT, testes de integração e documentação interativa via Swagger.

---

## 🧠 Sobre o projeto

Esta API permite:

* 🔐 Autenticação de usuários (JWT)
* 🎓 CRUD completo de alunos
* 🧪 Testes de integração com Vitest + Supertest
* 📄 Documentação com Swagger
* 🗄️ Persistência com PostgreSQL (Docker) + Prisma ORM

---

## 🛠️ Tecnologias utilizadas

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Docker
* JWT (JSON Web Token)
* Zod (validação)
* Vitest + Supertest
* Swagger (OpenAPI)

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/AndyTex2003/projeto-portifolio-pessoal-mt3.git
cd projeto-portifolio-pessoal-mt3
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Subir o banco com Docker

```bash
docker start postgres-db
```

---

### 4. Rodar migrations

```bash
npx prisma migrate deploy
```

---

### 5. Rodar seed

```bash
npm run prisma:seed
```

---

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

## 📄 Documentação Swagger

Acesse:

```bash
http://localhost:3000/api-docs
```

---

## 🧪 Testes

Rodar testes de integração:

```bash
npm test
```

✔ Cobertura de cenários:

* Sucesso (200 / 201)
* Validação (400)
* Autenticação (401)
* Não encontrado (404)

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
```

---

## 🚀 Funcionalidades

### Auth

* POST /api/auth/login

### Students

* GET /api/students
* POST /api/students
* PUT /api/students/:id
* DELETE /api/students/:id

---

## 💡 Objetivo

Projeto desenvolvido para prática de:

* Desenvolvimento backend
* Testes de API
* Boas práticas com Node.js
* Estrutura profissional de aplicações

---

## 👨‍💻 Autor

Anderson Santos
[LinkedIn](https://www.linkedin.com/)

---
