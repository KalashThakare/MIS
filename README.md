# MIS

Module-first TypeScript backend using Node.js and Express.

## Scripts

- `yarn dev` starts the API in watch mode.
- `yarn build` compiles TypeScript into `dist`.
- `yarn start` runs the compiled API.
- `yarn typecheck` validates types without emitting files.

## Architecture

- `server.ts` starts the HTTP server and owns graceful shutdown.
- `src/app.ts` creates the Express app and wires modules/middleware together.
- `src/modules` contains feature modules. Each module owns its controller, service, repository, routes, types, tests, and public `index.ts`.
- `src/shared` contains stable cross-cutting code such as database helpers, middleware, errors, utilities, logger, and shared types.
- `src/infrastructure` contains external integrations such as email, storage, queues, and cache clients.

The sample health endpoint is available at `GET /api/v1/health`.
