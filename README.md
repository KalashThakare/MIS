# MIS

Module-first TypeScript backend using Node.js and Express.

## Setup Instructions

1. Install Node.js 20+ and Yarn.
2. Install dependencies:
	- `yarn install`
3. Create a `.env` file in the project root (see Environment Variables below).
4. Ensure your database is reachable and the `DATABASE_URI` is valid.

## Environment Variables

Required:

- `DATABASE_URI` - Database connection string.
- `JWT_SECRET` - Secret used to sign JWTs.
- `SLACK_WEBHOOK_URL` - Slack webhook URL for notifications.
- `GROQ_API_KEY` - Groq API key for meeting analysis.

Optional:

- `PORT` - Server port (default: 8000).
- `API_PREFIX` - API base path (default: `/api/v1`).
- `NODE_ENV` - `development` | `test` | `production` (default: `development`).
- `JWT_EXPIRES_IN` - JWT expiry (default: `1d`).

Example `.env`:

```env
PORT=8000
API_PREFIX=/api/v1
NODE_ENV=development
JWT_EXPIRES_IN=1d
DATABASE_URI=postgres://user:pass@localhost:5432/mis
JWT_SECRET=replace-me
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
GROQ_API_KEY=replace-me
```

## Scripts

- `yarn dev` starts the API in watch mode.
- `yarn build` compiles TypeScript into `dist`.
- `yarn start` runs the compiled API.
- `yarn typecheck` validates types without emitting files.
- `yarn seed` runs database seed data.

## Architecture

- `server.ts` starts the HTTP server and owns graceful shutdown.
- `src/app.ts` creates the Express app and wires modules/middleware together.
- `src/modules` contains feature modules. Each module owns its controller, service, repository, routes, types, tests, and public `index.ts`.
- `src/shared` contains stable cross-cutting code such as database helpers, middleware, errors, utilities, logger, and shared types.
- `src/infrastructure` contains external integrations such as email, storage, queues, and cache clients.

The sample health endpoint is available at `GET /api/v1/health`.

## Local Execution Steps

1. Start the API in watch mode:
	 - `yarn dev`
2. (Optional) Seed the database:
	- `yarn seed`
3. Open Swagger UI:
	 - `http://localhost:8000/docs`

## Deployment Instructions

1. Build the project:
	 - `yarn build`
2. Start the compiled server:
	 - `yarn start`
3. Set the same environment variables in your hosting platform.

Notes:
- Ensure database connectivity from your deployment environment.
- `API_PREFIX` affects all routes and Swagger base URL.

## API Usage Examples

Replace the base URL if you run on a different host or port.

Health:

```bash
curl http://localhost:8000/api/v1/health
```

Register:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","name":"User","password":"secret"}'
```

Login:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"secret"}'
```

Create Meeting:

```bash
curl -X POST http://localhost:8000/api/v1/meeting \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"title":"Weekly Sync","participants":["a@example.com"],"meetingDate":"2026-06-05T10:00:00Z","transcript":[{"timestamp":"00:01","speaker":"A","text":"Welcome"}]}'
```

List Meetings:

```bash
curl -H "Authorization: Bearer <token>" \
	"http://localhost:8000/api/v1/meetings?page=1&limit=10"
```

Evaluate:

```bash
curl http://localhost:8000/api/v1/evaluation
```
