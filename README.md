# SENTINEL

SENTINEL turns field-execution evidence into traceable, human-verified schedule intelligence. The approved Figma Make interface remains the visual baseline while the application is progressively connected to real authentication, data, storage and backend workflows.

## Repository structure

```text
src/                    React web application
server/                 Node.js API and ingestion worker
packages/domain/        Shared roles, permissions and request schemas
supabase/migrations/    Versioned Postgres, RLS and Storage definitions
supabase/seed.sql       Canonical synthetic development data
docs/                   Architecture and implementation guidance
```

## Local setup

Requirements: Node.js 24, pnpm 11, Docker and the Supabase CLI.

1. Copy `.env.example` to `.env` and replace the placeholder values.
2. Start local Supabase with `supabase start`.
3. Apply the database and seed with `supabase db reset`.
4. Install dependencies with `pnpm install`.
5. Start the web app with `pnpm dev`.
6. Start the API with `pnpm dev:api`.
7. Start the ingestion worker with `pnpm --filter @sentinel/api dev:worker`.

Without Supabase browser variables, the web app runs in explicit demo-auth mode. Demo mode is for UI development only and must be disabled in production.

## Verification

Run `pnpm check` before opening a pull request. It verifies frontend and API types, unit tests and both production builds. GitHub Actions also resets and lints the Supabase database from the committed migrations.

## Security boundaries

- The browser uses the Supabase publishable/anonymous key only.
- The service-role key and database connection string exist only in the Node environment.
- Postgres Row Level Security protects project-scoped reads.
- Material mutations pass through the Node API, which validates the Supabase session and project permission.
- Original documents are private and use short-lived signed upload URLs.
- Verification decisions and audit events are append-only records.

See [docs/architecture.md](docs/architecture.md) for the end-to-end workflow.
