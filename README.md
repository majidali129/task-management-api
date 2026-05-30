# Task Management API

A NestJS REST API for authenticated task management with user signup, signin, and task CRUD operations.

## Features

- User registration and login
- JWT authentication using `Authorization: Bearer <token>`
- Create, read, update, and delete tasks
- Per-user task isolation
- MongoDB persistence via Mongoose

## Requirements

- Node.js 20+ (or compatible)
- pnpm
- MongoDB instance
- Environment variables:
  - `DB_URI` – MongoDB connection URI
  - `JWT_SECRET` – secret used to sign JWT tokens

## Setup

```bash
pnpm install
```

Create a `.env` file at the project root with at least:

```env
DB_URI=mongodb://localhost:27017
JWT_SECRET=yourSecretKey
```

## Run the project

```bash
pnpm run start:dev
```

## Build the production bundle:

```
pnpm run build
```

## API Base URL

When running locally, the API is available at:

```
http://localhost:3000
```

We can access resources at:

```
http://localhost:3000/tasks
```

For Authentication:

```
http://localhost:3000/auth/signup
http://localhost:3000/auth/login
```

Swagger documentation is accessible at:

```

http://localhost:3000/api

```

## Notes

- The API uses Mongoose and requires `DB_URI` to connect to MongoDB.
- JWT tokens expire after 3 hours.
