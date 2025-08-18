# Resource Allocation API

A RESTful API built with **Node.js**, **Express**, and **Prisma ORM** to manage projects, positions, resources, allocations, and users.  
Includes authentication (JWT), role-based authorization, soft deletes, and validation rules.

---

## Dependencies

The project uses the following main dependencies:

- **express** → HTTP server framework for building routes and controllers.
- **@prisma/client** → Database ORM for PostgreSQL/MySQL/SQLite.
- **bcrypt** → Password hashing for user authentication.
- **jsonwebtoken** → Generating and verifying JWTs for authentication.
- **dotenv** → Loads environment variables from `.env`.
- **jest** → JavaScript testing framework.
- **supertest** → HTTP assertions for API testing.

---

## Installation

### Prerequisites
- Node.js
- npm
- Railway

### Steps
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/resource-management-api.git
   cd resource-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file in the root with:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/yourdb"
   JWT_SECRET="supersecretkey"
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The API should now be running at `http://localhost:3000`.

---

## API Endpoints

### Auth
- **POST** `/login` – authenticate user and receive a JWT

### Users
- **GET** `/users` – list all users
- **POST** `/users` – create a user

### Projects
- **GET** `/projects` – list all projects
- **GET** `/projects/:id` – get project by ID
- **POST** `/projects` – create a project
- **PUT** `/projects/:id` – update a project
- **DELETE** `/projects/:id` – soft delete a project
- **GET** `/projects/:id/positions` – list all positions for a project

### Positions
- **GET** `/positions` – list all positions
- **GET** `/positions/:id` – get position by ID
- **POST** `/positions` – create a position
- **PUT** `/positions/:id` – update a position
- **DELETE** `/positions/:id` – soft delete a position
- **GET** `/positions/:id/allocations` – list all allocations for a position

### Resources
- **GET** `/resources` – list all resources
- **GET** `/resources/:id` – get resource by ID
- **POST** `/resources` – create a resource
- **PUT** `/resources/:id` – update a resource
- **DELETE** `/resources/:id` – soft delete a resource

### Allocations
- **GET** `/allocations` – list all allocations
- **GET** `/allocations/:positionId/:resourceId` – get allocation by composite key
- **POST** `/allocations` – create allocation
- **PUT** `/allocations/:positionId/:resourceId` – update allocation
- **DELETE** `/allocations/:positionId/:resourceId` – soft delete allocation

---

## Entities Overview

### User

- Represents the people who can access the system.

- Contains login credentials and role information.

- Roles determine what actions the user can perform. There are 3 available roles:
  -  **admin** - can perform all operations.
  -  **editor** - can do anything except for **DELETE** operations.
  -  **viewer** - only have access to **GET** operations.

### Project

- Represents an initiative or piece of work that positions and resources can be associated with.

### Position

- Represents a role or job title within a project.

- Linked to a specific project.

- Can be filled by resources through allocations.

### Resource

- Represents an individual or asset that can be assigned to positions.

- Can have attributes like name, birthday, and other details.

- Resources are assigned to positions via allocations.

### Allocation

- Represents the assignment of a resource to a position.

- Connects a resource to a position within a project.

---

## Testing with Postman

You can test endpoints using a GUI client like Postman. 
- Import the endpoint routes to Postman.
- Make sure to include `Authorization: Bearer <token>` since these requests are protected. These authentication tokens can be generated via the `/login` method.

---

## Notes

- Code is organized by **controllers**, **services**, **routes** and **utils** for clear separation of concerns.
- Soft deletes are handled by updating `is_deleted` instead of removing records.
- Validation utilities are in `src/utils/validationUtils.js`.
- Duplicate prevention and field validations (email format, date ranges, etc.) are enforced in the service layer.
