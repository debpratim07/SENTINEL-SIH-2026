# CURRENT IMPLEMENTATION STATE — SENTINEL

> Historical checkpoint: this document describes the 14 September 2026 foundation and is superseded by the Phase 9 accepted state plus `PHASE_10_PARITY_MATRIX.md`. It must not be used as the current product inventory.

Checkpoint: **14 September 2026**. Active project: **SIH26122, Oil India Limited — field-report linking to L5/L6 schedule activities**. SIH26165 (UA/UC near-miss/SIF precursors) is historical context, not this implementation's scope.

This document records existing implementation and previously completed validation. No application code, configuration, UI, assets or database records were changed for this checkpoint. Tests were not rerun for this documentation-only task.

## 1. What works now

The first connected **manual capture → human approval → persisted actual date and audit** workflow works through a React frontend, a local Node API and hosted Supabase. It is an initial functional backend milestone, not the complete production product.

The live administrator test saved a synthetic P-204 alignment report, left the actual blank while review was pending, approved its start as **2026-08-24**, and retained that date and both audit actions after a full page reload. Actual finish remains unknown. A separate signed-in account without membership could not see the project.

## 2. Frontend: real data versus sample data

| Surface | Current state |
| --- | --- |
| `/workspace` account creation, sign-in and project access | Real Supabase authentication and database membership. |
| `/workspace` manual capture, reported events, L6 review, planned/actual table and recent audit | Real API/database reads and writes. The currently loaded project and field report are deliberately synthetic demo data stored in the real database. |
| `/` original Figma login and application shell | Prototype flow with simulated login and UI role switching; these controls grant no backend permissions. |
| Original Figma dashboard, reports/report analysis, capture/upload drawers, review queue, schedule/detail/timeline, actuals, exceptions, performance, insights, audit, admin, profile/search/notifications | Mock/sample data or local UI behavior. These screens have not been connected to the new database workflow. |

The connected workspace is a separate, simpler interface. It has **not** replaced or been integrated into the original Figma design. A link on the prototype login opens it. The two interfaces currently look different; merging them into one consistent experience is pending.

## 3. Supabase and authentication

- The existing hosted Supabase development project was resumed and successfully connected; no paid upgrade was requested. Region: Seoul (`ap-northeast-2`).
- Applied migrations: `001_manual_reconciliation.sql`, then `002_administrator_workflow.sql`. Ten application tables have row-level security enabled; nine read policies were verified.
- Email/password signup, email confirmation, sign-in, persisted/refreshed sessions and local sign-out are implemented. Signup requires at least 12 password characters in the UI.
- Two accounts were email-confirmed at the last verification. The user-approved account has **project-scoped Administrator** membership; the other account remains unassigned. No account identifiers or credentials are reproduced here.
- Signup alone grants no project access. Membership is provisioned by a database owner; there is no public self-assignment or membership-management UI/API. Project Administrator is not Supabase organization administrator or database owner.
- The API validates the session with Supabase Auth and forwards the same authenticated identity to database requests. The application does not use a service-role secret.
- The confirmation-routing bug was fixed: callbacks arriving at the site root route to `/workspace`; signup requests that destination directly. Invalid/expired callbacks provide a safe sign-in explanation to signed-out users. Production email delivery and redirect configuration still need deployment-specific validation.
- Password-reset and in-app confirmation-resend flows are not implemented.

## 4. Database-backed workflow

Tables store schema versions, projects, memberships, schedule versions, activities, original reports, proposed events, review decisions, schedule actuals and audit events. The seed contains **SENTINEL Competition Demo (Synthetic)**, one schedule version, one L5 parent and three L6 pump-alignment activities.

**Manual reporting:** Enter report date, original text, an exact supporting quote, event type (start, finish or partial-progress observation), and an optional actual date. One proposed event is stored per report. The quote must occur in the original text; actual dates cannot exceed the report date. Unknown dates remain null. Capture records evidence and an audit action but does not update actual dates. Retry keys prevent duplicate writes for the same request.

**Review/approval:** A planner, project-controls reviewer or project administrator manually selects an active-schedule L6 activity and supplies a reason. The database checks membership, project/version, event revision, supported event/date, existing actuals and date ordering. One transaction saves the decision, actual, verified event and audit; failure rolls everything back. Existing verified actual dates cannot be overwritten. L5, missing-date and partial-progress approvals are blocked.

**Roles:** Supervisors and discipline engineers can capture; planners, project controls and administrators can capture and approve. Project managers can read their project. Audit is visible to planners, project controls and administrators. Direct client table writes and client invocation of the internal role-check helper remain blocked for all roles.

**Audit:** Capture and verification actions persist with actor, time, record and structured details. The current UI shows recent action/time/record entries; it does not expose a complete audit-detail experience. Records are protected from application-client edits, not tamper-proof against privileged database owners.

## 5. Validation status

Last completed validation: **14 September 2026**.

| Check | Result |
| --- | --- |
| PostgreSQL/PGlite database tests | 16 passed |
| API tests with an injected Supabase client | 7 passed |
| Auth-callback routing regression tests | 3 passed |
| Frontend and server TypeScript checks | Passed |
| Production frontend build | Passed; large-chunk warning remains |
| Real administrator capture → approval → full reload | Passed; verified date and two audit actions persisted |
| Separate unassigned-account project visibility | No project access, as expected |

Total: **26 automated tests passed**. Database tests are sequential with a minimal test auth schema. Separate supervisor/planner browser testing, multi-connection concurrency stress, backup/restore and hosted deployment testing remain outstanding. The live test used one administrator for both capture and approval; it does not demonstrate enforced separation of duties.

## 6. Pending work and known limits

**AI extraction and matching are NOT implemented.** There are no real model calls, embeddings, ranked AI candidates or calibrated confidence scores in the connected workflow. Any such behavior in the Figma prototype is simulated.

Also pending:

- Connect the backend to the original Figma screens and unify the normal user journey; no new redesign or branding work has started in this checkpoint.
- Schedule-file import, full hierarchy validation, multiple extracted events per report and attachments.
- Rejection, clarification, correction, duplicate resolution and explicit conflict-resolution workflows. Pending reports that contradict one another are not automatically linked. Blocked reports can remain pending with no resolution interface.
- L5 rollups, richer audit detail, production exports and P6/Microsoft Project integrations.
- Pagination: current reads are capped at 200 events/activities/actuals and 50 audit entries. Independent reads are not a single consistent database snapshot; large schedules are not fully supported.
- Cross-session push updates; users currently refresh records. Retry keys in forms are not a durable offline queue.
- Production hosting, HTTPS deployment setup, shared rate limiting, operational monitoring and recovery checks. The API rate limit is per process; the frontend build has an approximately 1.26 MB uncompressed JavaScript chunk warning.

The local setup requires both frontend and API processes. The health endpoint checks API process availability, not database readiness. The only connected route is `/workspace`; original prototype navigation is still separate.

## 7. GitHub and local-only state

Source repository: [debpratim07/SENTINEL-SIH-2026](https://github.com/debpratim07/SENTINEL-SIH-2026).

- Uploaded branch: `codex/connected-workspace-foundation`.
- Commit: `bff2737f49c10beb47a6a09d6584a289dbadf7c9`.
- [Draft PR #2](https://github.com/debpratim07/SENTINEL-SIH-2026/pull/2) is open and **not merged into main**, confirmed during this checkpoint.
- The local directory is a connector-derived source snapshot, not a Git clone. Comparison against its uploaded source manifest found 27 exact file matches and 74 files differing only in newline formatting; no additional non-environment source files or unresolved functional differences were found.
- **No important functional application changes remain unpushed** relative to that branch. Do not confuse “uploaded to the branch” with “merged into main.”
- Local-only material includes ignored `.env.local`, installed dependencies, generated build output, source archives/checkpoint documents and workspace bookkeeping. This new checkpoint is not uploaded. Environment contents are intentionally omitted.
- Hosted account memberships and the approved synthetic report are database state, not repository files. Migrations and seed scripts are uploaded; the seed does not recreate accounts, memberships or the subsequently approved report.

## 8. Run, build and test commands

Run from `work/SENTINEL-SIH-2026` under the current workspace. Previously tested runtime: Node 24.19.0 and pnpm 11.19.0; declared minimum Node version is 22.18.0.

```sh
# Install locked dependencies when needed
pnpm install --frozen-lockfile
pnpm --dir database install --frozen-lockfile

# Keep these running in separate terminals
pnpm run dev:api
pnpm run dev --port 5173 --strictPort

# Checks
node node_modules/typescript/bin/tsc --noEmit
pnpm run check:server
pnpm run test:api
pnpm --dir database test
pnpm run build
```

Frontend: `http://127.0.0.1:5173/workspace`. API: loopback port 5174, reached through Vite's `/api` proxy. The direct TypeScript command above avoids an observed Windows `pnpm exec tsc` command-resolution issue. `pnpm run preview` exists for built-frontend preview but is not a production backend deployment.

## 9. Expected environment variables — names only

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project endpoint, used by frontend and API. Required for the connection. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client connection setting, used by frontend and API. Required; no value is included here. |
| `API_PORT` | Optional local API listening port. Keep it aligned with the Vite proxy. |
| `ALLOWED_ORIGINS` | Optional comma-separated browser-origin allowlist for the API. |
| `PORT` | Optional Vite/Figma development and preview port setting; the explicit command above selects the intended local port. |
| `FIGMA_PUBLIC_URL` | Optional inherited Figma deployment base-path setting. Not needed for ordinary local operation. |

The local connection file is `.env.local`; `.env.example` documents the expected names. No AI-provider environment variable is currently consumed. This checkpoint contains no credential values and does not change environment settings.
