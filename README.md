# SENTINEL

SENTINEL turns field execution evidence into human-verified schedule actuals and connected project intelligence for large infrastructure work.

## Product surfaces

The primary `/` application uses real Supabase authentication, project memberships, backend-authoritative roles and the Phase 9 industrial visual/motion system. Its connected navigation includes:

- Dashboard with milestone-based Plan %, Execution %, variance, late work, pending review, exceptions, recent execution and discipline performance.
- Manual capture and server-side report ingestion for PDF embedded text, DOCX, XLSX, CSV and TXT.
- Evidence-grounded deterministic extraction plus an optional server-only structured AI provider boundary.
- Review Queue and human verification before any actual date becomes authoritative.
- Schedule, Verified Actuals, Exceptions, Performance, Data Quality and historical Execution Knowledge.
- Project-scoped search, derived attention notifications, persisted audit history and Administrator Team Access.
- A truthful Integrations page: scanned-document OCR, voice, Primavera P6 and Microsoft Project are not presented as connected.

`/workspace` remains a connected engineering fallback for manual capture, review, schedule and audit checks. It is not a sample-data prototype and does not replace the primary application.

## Trust model

- A captured or extracted event remains pending until an authorized planner, project-controls reviewer or project administrator verifies it against an eligible L6 activity.
- Unknown dates remain null. Analytics are deterministic and use only connected schedule, event, actual and report records.
- Uploaded sources are validated, size-limited, parsed on the server, hashed with SHA-256 and retained with candidate provenance.
- AI output is schema validated and must use exact source quotes and current-project activity IDs. Provider failure is explicit and falls back to deterministic extraction without claiming AI success.
- Browser code receives no provider secrets. Database functions, RLS and project memberships remain authoritative.

## Supported ingestion

The upload limit is 4 MB and extracted text is capped at 50,000 characters. Supported format/MIME pairs are PDF, DOCX, XLSX, CSV and UTF-8 TXT. PDF parsing reads embedded text only; scanned-image OCR is not enabled. Spreadsheet formulas are not executed.

Apply migrations in order through `database/migrations/004_phase10_ingestion.sql` before enabling report uploads in an environment.

## Local setup

Use Node 22.18 or newer and pnpm. Install dependencies, copy `.env.example` to `.env.local`, and supply the Supabase URL and publishable key. Never put a service-role key, model-provider key or password in a `VITE_` variable.

```sh
pnpm install --frozen-lockfile
pnpm --dir database install --frozen-lockfile
pnpm run dev:api
pnpm run dev --port 5173 --strictPort
```

The frontend uses `http://127.0.0.1:5173`; the API listens on loopback port 5174 and is reached through the `/api` proxy. `/api/health` checks process availability, not database readiness.

Optional structured extraction uses server-only `SENTINEL_AI_ENDPOINT`, `SENTINEL_AI_KEY` and `SENTINEL_AI_MODEL`. Without all three, deterministic extraction remains available and the response reports AI as unavailable.

## Validation

```sh
pnpm exec tsc --noEmit
pnpm run check:server
pnpm run test:api
pnpm run test:frontend
pnpm --dir database test
pnpm run build
```

The Phase 10 parity and metric contract is documented in `docs/PHASE_10_PARITY_MATRIX.md`. Use synthetic, non-sensitive reports for acceptance unless project material is expressly authorized.
