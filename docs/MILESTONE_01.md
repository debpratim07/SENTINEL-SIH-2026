# Milestone 01 — authenticated manual schedule reconciliation

Verified on 14 September 2026 for SENTINEL / SIH26122 / Oil India Limited.

## Live acceptance evidence

Using the user-approved Administrator account in **SENTINEL Competition Demo (Synthetic)** through the real browser, API and Supabase database:

1. Signed in and loaded the assigned project with the Administrator role.
2. Submitted a report dated 2026-08-28: “Pump P-204 alignment started on 24 August 2026 in Utility Block.” The exact sentence was retained as source evidence; actual date was 2026-08-24.
3. Observed the event awaiting review and confirmed that the schedule actual remained blank before approval.
4. Selected SYN-L6-P204, recorded a review reason and approved the actual start.
5. Verified the event status, actual start 2026-08-24, unknown actual finish, and capture/verification audit entries.
6. Fully reloaded the page. The session, project, verified date and both audit entries persisted.
7. Separately reloaded a signed-in account without membership and verified that it could not see the project.

Event ID: `3b5c3245-4395-4ea2-978b-84937855344a`. This is synthetic demo evidence; it is not a real Oil India field report. Leave the approved date in place. A second report targeting that same actual is deliberately blocked from overwriting it.

## Automated validation

- 16 PostgreSQL/PGlite database tests passed, including administrator permissions, project isolation, date constraints, idempotency and rollback.
- 7 API tests passed with an injected Supabase client.
- 3 auth-callback routing regression tests passed.
- Frontend/server type checks and the production build passed. A large frontend chunk warning remains.

Migration 001 creates the guarded workflow. Migration 002 extends its internal role check to assigned project administrators. Direct client table writes, the internal role helper and membership self-assignment remain inaccessible. The administrator role is project-scoped; it does not provide Supabase organization or database-owner access.

## Current boundaries

This completes the first manual connected workflow, not the full product. AI extraction/ranking, schedule import, clarification/correction, conflict resolution, pagination, L5 rollups, P6/MS Project integrations and public production hosting are not implemented. The original Figma prototype remains a separate sample-data preview.

The live test used an administrator performing capture and review in the same account. Separate supervisor/planner browser testing, concurrent-session stress, backup/restore and hosted deployment checks remain outstanding. Automated tests exercise the role rules but do not replace those operational checks.

## Next work

Wait for the project owner's next input before beginning the next milestone. Preserve human verification, exact evidence and unknown-date handling in subsequent AI work.
