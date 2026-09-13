# SENTINEL — SIH26122

Oil India Limited field-report to L5/L6 schedule reconciliation. Code after the Figma Make handoff belongs in `debpratim07/SENTINEL-SIH-2026`. SIH26165 (UA/UC near-miss SIF precursors) was an earlier identity confusion and is not this implementation's scope.

## Current implementation

`/workspace` provides Supabase email/password sign-in, assigned-project access, manual field-event capture, human approval of L6 actual dates, persisted actuals and audit history. It talks to the local API and hosted database. The migration and synthetic schedule are applied. Two accounts are email-confirmed, and signed-in API identity lookup has been verified. Administrator membership has been assigned to the user-approved account. The separate unassigned account remains isolated. The live administrator capture → approval → full reload check passed on 14 September 2026. P-204 has a verified actual start of 2026-08-24; actual finish remains unknown, and both audit actions persist.

`/` retains the Figma interactive prototype with sample data and simulated workflows. Its role selector does not confer permissions in the connected workspace.

No live AI extraction/matching, Primavera P6 or Microsoft Project integration is implemented. This is the first backend foundation, not a production-ready deployment.

## Run locally

Use Node 24 LTS (tested with 24.19.0) and pnpm (tested with 11.19.0). Native TypeScript execution/config loading requires Node 22.18 or newer. From this repository:

```sh
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env.local` and set the project's Supabase URL and **publishable** key. The publishable key is intended for browser use; protection comes from authenticated membership and database policies. Never put a service-role key, secret API key or password in frontend variables. `.env.local` is ignored by Git.

Start two terminals from this directory:

```sh
pnpm run dev:api
```

```sh
pnpm run dev --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/workspace`. The API listens on loopback port 5174; Vite forwards `/api` to it. Keep both terminals running. `/api/health` checks the process only, not database readiness. Keep `API_PORT`, the Vite proxy and allowed origins aligned when changing ports.

## First account and live acceptance check

1. The user creates their account from `/workspace`, enters their own password (at least 12 characters), confirms any verification email and signs in. Do not share passwords with an assistant or teammates.
2. An owner assigns the verified auth identity an `administrator` membership in the synthetic project. There is no public self-assignment endpoint. Teammates receive only their intended role.
3. For a fresh project, capture a synthetic report dated 2026-08-28: **Pump P-204 alignment started on 24 August 2026 in Utility Block.** Use that sentence as the supporting quote, event type Actual start and date 2026-08-24.
4. Confirm the event awaits review and the actual remains blank. Select `SYN-L6-P204`, supply a reason and verify.
5. Refresh, sign out and sign in. Confirm actual start persists as 2026-08-24, actual finish stays blank and audit shows capture and verification.
6. With a separate supervisor account, confirm capture works and approval is denied. An account without membership must see no project data. The existing hosted demo already contains the P-204 start below; do not expect a second approval of that same actual to succeed. See `docs/MILESTONE_01.md` for the completed run.

Email delivery and redirects depend on Supabase Auth settings. Signup now requests `/workspace` as the confirmation destination. If the service falls back to the root site URL, root auth callbacks also route to `/workspace` while preserving the SDK's session parameters. Invalid/expired callback links show a safe sign-in explanation to signed-out users. Before a hosted demo, configure and test the exact HTTPS site URL and confirmation redirect allowlist; retain email confirmation. Password reset UI is not yet implemented.

## Validation

```sh
pnpm exec tsc --noEmit
pnpm run check:server
pnpm run test:api
pnpm run build
pnpm --dir database install --frozen-lockfile
pnpm --dir database test
```

16 database tests, 7 API tests and 3 auth-callback routing tests passed. Database tests use PostgreSQL via PGlite; API tests use an injected Supabase client. Hosted checks confirmed schema and grants. Browser checks verified confirmed sessions reaching the account-ready screen through a real authenticated API lookup. A root error callback also reached the workspace. The live administrator capture/approval/reload acceptance check also passed. Separate supervisor/planner browser testing, deployment and concurrency tests remain future validation. The build currently warns about a large frontend chunk.

See `database/README.md` for schema, roles and limits. API validation, membership enforcement, retry keys and atomic approval are implemented. Rate limiting is per process. Production needs shared limits, HTTPS, monitoring, backup/restore verification and an application host. `vite preview` alone is not a deployed backend.

## Next milestones

1. The first live manual workflow milestone is verified. Next, validate schedule import and exception handling with a larger labelled dataset; retain the existing synthetic report as demo evidence.
2. Add schedule import validation, pagination, correction/clarification and explicit conflict resolution.
3. Add server-side structured AI extraction with source evidence, ranked candidate activities, a labelled evaluation set and human approval. Keep model guesses separate from verified actuals.
4. Validate L5 rollups, exports, audit detail and real multi-user behavior.
5. Deploy secured staging, rehearse failure/retry cases and prepare measured results for judges.

Use synthetic competition data until actual project data is authorized. Describe each feature according to tested status; a matching score never replaces human verification.


