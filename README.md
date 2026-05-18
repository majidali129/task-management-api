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
pnpm run start
```

The API runs by default on `http://localhost:3000`.

## API Reference

### Authentication

#### Sign up

- Method: `POST`
- URL: `/auth/signup`
- Body:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "strongpassword"
  }
  ```
- Success response:
  - Status: `201`
  - Body:
    ```json
    {
      "id": "<userId>",
      "message": "User created successfully",
      "status": 201
    }
    ```

#### Sign in

- Method: `POST`
- URL: `/auth/signin`
- Body:
  ```json
  {
    "email": "jane@example.com",
    "password": "strongpassword"
  }
  ```
- Success response:
  - Status: `200`
  - Body:
    ```json
    {
      "message": "Login successful",
      "userId": "<userId>",
      "token": "<jwtToken>"
    }
    ```

### Tasks

All task routes require a valid JWT token in the request header:

```http
Authorization: Bearer <token>
```

#### Create task

- Method: `POST`
- URL: `/tasks`
- Body:
  ```json
  {
    "title": "Write report",
    "description": "Summarize last week progress"
  }
  ```
- Success response: created task object

#### Get all tasks

- Method: `GET`
- URL: `/tasks`
- Success response: array of tasks for the authenticated user

#### Get task details

- Method: `GET`
- URL: `/tasks/:id`
- Success response: single task object

#### Update task

- Method: `PATCH`
- URL: `/tasks/:id`
- Body:
  ```json
  {
    "title": "Write final report",
    "description": "Include client feedback"
  }
  ```
- Success response: updated task object

#### Delete task

- Method: `DELETE`
- URL: `/tasks/:id`
- Success response:
  ```json
  {
    "message": "Task deleted successfully",
    "id": "<taskId>"
  }
  ```

### Task object schema

A task record includes:

- `_id`: task identifier
- `title`: task title
- `description`: task description
- `status`: one of `pending`, `in-progress`, or `completed`
- `userId`: owning user ID
- `createdAt`: creation timestamp
- `updatedAt`: last updated timestamp

## Notes

- The API uses Mongoose and requires `DB_URI` to connect to MongoDB.
- JWT tokens expire after 3 hours.
- Protected task routes are enforced by `src/guards/auth.guard.ts`.
