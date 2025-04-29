# VetaBase Backend

A Node.js/Express/Sequelize backend for a veterinary clinic, featuring robust authentication, role-based access, DRY validation, generic CRUD logic, and audit logging with Winston. Includes Swagger (OpenAPI) documentation for easy frontend integration and testing.

## Features
- **Authentication & Authorization:** JWT-based login, admin/user roles, and role-based access control.
- **DRY Validation:** Centralized validation middleware using express-validator.
- **Generic CRUD:** Factory-based CRUD controllers for all main resources.
- **Audit Logging:** All key actions (create, delete, login, register, etc.) are logged to `app.log` using Winston.
- **Swagger Docs:** Interactive API documentation at `/api-docs`.
- **Global Error Handling:** Consistent error responses via middleware.
- **Production-Ready:** CORS, environment config, and security best practices.

## Main Endpoints
- `/auth/login` — User login (returns JWT)
- `/auth/register` — Register new user (admin only)
- `/auth/user` — Delete user (admin only)
- `/patsiendid` — Patients (CRUD, admin/user)
- `/kliendid` — Clients (CRUD, admin/user)
- `/liigid` — Species (CRUD, admin/user)
- `/visiidid` — Visits (CRUD, admin/user)
- `/haiguslood` — Medical records (CRUD, admin/user)
- `/tootajad` — Employees (CRUD, admin/user)
- `/spetsialiseerumised` — Specializations (CRUD, admin/user)

> **Note:** All endpoints except `/auth/login` require a valid JWT and either Admin or User role. Admin-only endpoints are clearly marked in Swagger docs.

## Installation

Install all required dependencies:

```sh
npm install express sequelize tedious dotenv swagger-jsdoc swagger-ui-express express-validator jsonwebtoken bcryptjs cors winston
```

- `express` — Web framework
- `sequelize` — ORM for SQL databases
- `tedious` — Microsoft SQL Server driver
- `dotenv` — Loads environment variables from `.env`
- `swagger-jsdoc` & `swagger-ui-express` — API documentation
- `express-validator` — Input validation
- `jsonwebtoken` — JWT authentication
- `bcryptjs` — Password hashing
- `cors` — CORS middleware
- `winston` — Logging


## Setup

1. Copy `.env.example` to `.env` and fill in your database credentials.
2. Run the app with `npm start` or `npm run dev`.

## Access API docs:
   - Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Logging
- All important actions are logged to `app.log` in the project root.
- Log entries include timestamp, user, action, and relevant data.

## Project Structure
```
├── main.js                # App entry point
├── logger.js              # Winston logger setup and helpers
├── routes/                # All Express route files
├── controllers/           # Generic CRUD controller
├── middleware/            # Auth, validation, error handler
├── models/                # Sequelize models
├── config/                # DB config and connection
├── app.log                # Audit log file
├── package.json           # NPM dependencies and scripts
```

## Security
- All non-admin endpoints require authentication and either Admin or User role.
- Admin-only endpoints require Admin role.
- JWT secret and DB credentials are loaded from `.env`.

## Development & Testing
- Use Swagger UI for interactive API testing.
- Use the audit log (`app.log`) to review all actions.

## Database Backup & Restore

A backup of the database is available in `DB_SaarniitRasmus27.04.sql` in the project root.

**To restore the database:**
1. Open SQL Server Management Studio (SSMS) or your preferred SQL tool.
2. Create a new database (if needed).
3. Open the `DB_SaarniitRasmus27.04.sql` file and execute its contents on your SQL Server.
   - In SSMS: File → Open → File... → select the `.sql` file, then click Execute.
4. Update your `.env` file with the correct database name and credentials if needed.

> **Note:** The backup file contains the schema and data as of 27.04.2025. If you update the database, consider exporting a new backup for future use.

Lisbeth Männiste ja Rasmus Saarniit

## License
MIT


