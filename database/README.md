# SENTINEL database foundation

Active scope: SIH26122 heavy-industry L5/L6 schedule reconciliation.

## Applied infrastructure

On 13 September 2026, the existing Supabase project `puxealxppuujrxheqbmh` in organization SENTINEL was resumed with user authorization. Its region is `ap-northeast-2` (Seoul); no paid upgrade was requested.

The inventory found no application tables, auth users or storage buckets. Migration `001_manual_reconciliation.sql` was applied successfully. Hosted verification returned 10 tables with RLS enabled, 9 read policies, no anonymous approval permission and no direct authenticated write permission on schedule actuals. The first schema version is `001_manual_reconciliation`. Migration `002_administrator_workflow` was subsequently applied on 14 September 2026, enabling assigned project administrators to capture and approve through the same guarded functions. Migration `003_admin_membership_management.sql` was applied on 15 September 2026. It adds guarded project-member list, exact-email assignment, role change, deactivation/reactivation, last-active-administrator protection, and `membership_changed` audit history. Migration `004_phase10_ingestion.sql` adds upload provenance, extracted-event metadata and the guarded `sentinel_ingest_report` transaction. It is validated locally and must be applied to each hosted environment before report uploads are enabled there.

`seeds/001_synthetic_schedule.sql` was also applied. It adds **SENTINEL Competition Demo (Synthetic)**, an August 2026 schedule version, one L5 parent and three L6 pump alignment activities. It creates no accounts, memberships, reports or actual dates. The seed is repeatable; apply the migration only once.

## Data flow and trust boundary

1. A person signs in through Supabase Auth; signup alone grants no project access.
2. An active project Administrator can assign an existing auth identity by exact email through the Node API and guarded database function. Signup alone never grants project access.
3. The API validates the access token with Supabase Auth and forwards that same token to the database, preserving row-level security.
4. Manual capture stores the original report, an exact supporting quote, the reported date and a proposed event. Unknown actual dates remain null.
5. A planner, project-controls reviewer or project administrator selects an L6 activity and supplies a reason.
6. The approval function locks records and validates role, active schedule, project, event revision and dates. It commits the decision, actual date, verified event and audit entry together, or rolls everything back.

Authenticated clients have project-scoped reads and no direct table writes. Only validated workflow and membership-management functions perform application writes; their search path is fixed and every membership function rechecks an active same-project Administrator. The app uses no service-role secret. The database owner remains privileged: audit records are application-protected, not tamper-proof against database administrators.

## Roles

| Role | Read project | Capture | Approve L6 actuals | Read audit |
| --- | --- | --- | --- | --- |
| site-supervisor | Yes | Yes | No | No |
| discipline-engineer | Yes | Yes | No | No |
| planner | Yes | Yes | Yes | Yes |
| project-controls | Yes | Yes | Yes | Yes |
| project-manager | Yes | No | No | No |
| administrator | Yes | Yes | Yes | Yes |

An administrator label comes only from an active project membership. Administrators can manage only their own project and cannot remove or demote its last active Administrator. Exact-email assignment reveals no unrelated account directory. Never use user-controlled metadata for authorization.

## Validation

Run `pnpm install --frozen-lockfile` and `pnpm test` from this directory. All 22 tests pass using PGlite PostgreSQL with a minimal test auth schema. Coverage includes isolation, permissions, exact evidence, report provenance, pending-only extraction, atomic cross-project rejection, dates, retries, stale revisions, L5 rejection, duplicate/conflicting actual protection, finish-without-start, audit visibility, transactional rollback, repeatable seeding, exact-email membership assignment, role/state changes, cross-project rejection and last-administrator protection.

These are sequential database tests, not live Supabase session tests or multi-connection concurrency stress tests. Two accounts have since been confirmed, and real signed-in identity lookup was checked in the browser. The requested administrator membership is assigned. The live administrator capture/approval/full-reload browser check passed on 14 September 2026; one synthetic P-204 start event is verified and its two audit actions persist. A second, unassigned account was verified to see no project data.

## Known limits

- Manual capture stores one event; uploaded reports may create up to 50 evidence-grounded pending candidates. AI suggestions never verify an actual.
- L6 actual dates only. L5 rollups and full imported-hierarchy validation are future work.
- Missing dates and partial observations can be stored but cannot update actual dates.
- Existing verified actuals cannot be overwritten. Rejection, clarification, correction and conflict-resolution workflows are not implemented. Potential conflicts among pending reports are not automatically linked.
- No scanned-image OCR, schedule import, scheduling-system writeback or push updates. Uploaded source bytes are processed transiently; extracted text and source hash are retained, not the original binary attachment.
- Reads are capped at 200 events/activities/actuals and 50 audit entries. Pagination is needed for large schedules; independent reads are not one consistent snapshot.
- Locking and uniqueness protect writes by design; live concurrency, backup/restore and deployment hardening remain unverified.

For another environment, run `inspect-existing.sql` and inspect existing objects before applying the migrations in numerical order. Do not drop existing data to make it fit the seed.


