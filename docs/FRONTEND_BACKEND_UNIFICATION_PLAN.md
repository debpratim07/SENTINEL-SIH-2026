# FRONTEND–BACKEND UNIFICATION PLAN — SENTINEL

Scope: planning only, based on the local implementation checkpoint dated 14 September 2026. This plan does not authorize a redesign, AI work, asset integration, schema changes, permission changes or changes to current backend logic.

## A. Current architecture

The project is a React/Vite application with two independent frontend experiences selected in `src/main.tsx`:

```text
/           → App.tsx → Figma-designed prototype shell
/workspace  → ConnectedWorkspace.tsx → real connected workflow
```

`/workspace` uses `src/lib/supabase.ts` for Supabase session handling and calls the loopback Node API through Vite's `/api` proxy. The API validates the Supabase access token, applies membership/RLS-scoped database access, and exposes project identity, workspace reads, manual event capture and review approval. The database stores projects, memberships, schedule versions/activities, reports/events, review decisions, actuals and audit events.

`/` is a single in-memory application shell. `App.tsx` switches screens with local `activeNav` state; it is not a browser-router route tree. Its login uses a fixed demonstration identity and timer. `RoleContext` implements simulated roles, navigation visibility and action permissions. The shell's strong visual system is reusable: sidebar, header, page layouts, drawers, modal components, filter controls, tables, typography, colors, light/dark tokens and reduced-motion baseline.

The original Figma shell contains no live API data. The connected workspace contains no use of the original shell's navigation, layouts or page components.

## B. Figma UI → real backend mapping

| Figma screen/component | Reuse value | Current backend source | First realistic connected scope |
| --- | --- | --- | --- |
| `LoginPage` | Visual login, forgotten-password layout and brand | Supabase auth client/session | Replace only the simulated submit path with real auth; keep account/signup/confirmation handling available. |
| `Sidebar`, `Header`, `ProfileMenu` | Primary application frame, project/identity presentation | `/api/me`, memberships, selected project | Use authenticated identity and server-provided role. Remove role-switch authority; a demo-only presentation mode may be visibly isolated later if needed. |
| `CaptureChooser`, `LogWithSentinelDrawer` | Capture entry point and drawer interaction | `POST /api/projects/:id/events` | Reuse only the manual text/evidence/date form. The animated “processing”, extracted fields and match preview are simulated and must not claim AI. |
| `ReviewQueue`, `ReviewMatchDrawer`, activity chooser | Review queue layout and human decision UI | workspace events/activities plus `POST /reviews` | Map pending manual events to review cards; retain exact evidence, L6 activity selection and a required reason. Hide unmatched/clarification actions until backend support exists. |
| `SchedulePage`, activity detail/timeline | Schedule browsing and planned-vs-actual presentation | activities + actuals from workspace data | Connect active-schedule activities and verified dates. Retain unknown values; do not derive L5 rollups yet. |
| `ActualsPage`, `ActualDetail` | Read-only actuals and provenance views | actuals, verified event, review decision/audit | Start with list/detail of verified L6 actuals; show source evidence and review decision only where returned by a supported API. |
| `AuditLogPage` | Audit table/filter visual language | audit events | Start with the current recent audit feed; expand only after a paginated/detail endpoint exists. Do not display mock confidence/matching signals. |
| `Dashboard` | Layout, KPI/card/table patterns | no complete dashboard endpoint | Keep sample-data-only until explicitly defined metrics are computed from real data. |
| Reports, analysis, exceptions, performance and insights | Visual designs and future destinations | no equivalent complete backend capability | Leave as prototype/sample screens until their data contract and operations exist. |
| `AdminPage` | Potential configuration visual reference | no membership-management endpoint | Do not connect or expose it for membership/permission changes yet. |

## C. Route migration plan

1. Preserve `/workspace` as the live, supported fallback throughout migration.
2. Keep `/` as prototype preview until real login plus the first connected Figma screens are accepted.
3. Introduce an explicit client route model only when implementation begins: `/login`, `/app/dashboard`, `/app/capture`, `/app/review`, `/app/schedule`, `/app/actuals`, `/app/audit`. Preserve legacy URLs through redirects; do not remove `/workspace` at that point.
4. Move the Figma shell beneath authenticated `/app/*` routes one screen at a time. At each step, link the old `/workspace` equivalent as a fallback while validating the new screen.
5. Redirect `/workspace` to the connected Figma screen only after capture, review, schedule and audit have passed the same end-to-end checks. Keep a temporary explicit legacy URL for one release/review cycle.
6. Remove the legacy standalone workspace only after no navigation, test, acceptance demo or rollback path depends on it. Keep the root prototype preview separately only if it is still useful for presentation; label it as sample data.

## D. Authentication migration plan

Authentication should ultimately sit before the Figma shell, not inside a separate workspace page. One app-level session provider should own `supabase.auth` session restoration, auth-state changes, sign-in/out and `/api/me` identity/membership lookup.

The provider must treat the server membership role as authoritative. Replace `RoleContext`'s simulated role permissions only for authenticated `/app/*` screens. Do not reuse the prototype role selector as authorization. Keep the existing callback routing, confirmed-account behavior, no-membership state and API token forwarding unchanged. Do not add password-reset, resend confirmation, membership editing or role switching in this migration unless separately scoped.

## E. Data/mock replacement plan

Create frontend adapters that translate real API records into view models instead of changing backend state names or forcing mock schemas into the API. Start with a single selected project and the existing workspace endpoints. Preserve `pending`/`verified`, `start`/`finish`/`progress_observation`, unknown date `null`, L5/L6 and current role names exactly.

Replacement sequence:

1. Shared authenticated identity/project context: replace `RoleContext` identity only in live screens.
2. Capture drawer: replace local submission/timers with one real manual-capture form and existing idempotency key behavior.
3. Review queue/drawer: replace `reviewMockData` only for events that the API can return and approve. Keep local mock fixtures isolated for prototype-only views.
4. Schedule/actuals: replace `scheduleData` and `actualsData` only in connected variants; map real activities and actuals without invented delay, status or aggregate data.
5. Audit: replace static `AUDIT_RECORDS` with the supported audit response, then add API fields/pagination only through a separately approved backend change.
6. Dashboard/reports/analysis/exceptions/performance/insights: retain explicit sample-data mode until endpoint contracts and operational rules exist.

Do not convert simulated extraction labels, confidence scores, candidate rankings, clarification outcomes, exception resolution or uploads into “real” UI states before they have real persisted backend support.

## F. Responsive-design phase

Responsive work follows functional migration of capture, review, schedule and audit. First establish shared shell breakpoints and test the authenticated Figma shell at desktop, tablet and phone widths. Then adapt each newly connected screen while retaining the existing data/permission behavior. Tables need intentionally designed overflow, condensed columns or card views; no real fields may disappear silently. Test keyboard operation, focus states, loading/error/empty states and `prefers-reduced-motion` with each connected screen. Do not perform broad responsive restyling before live screen parity exists.

## G. Motion/brand asset integration phase

Import the future approved asset pack only after functional Figma shell parity and responsive acceptance. Centralize assets and motion tokens, preserve current logos/colors/type hierarchy unless the pack explicitly supersedes them, and apply assets first to shared shell/auth/capture affordances. Motion must remain decorative or state-feedback only; it cannot imply AI processing, successful save, authorization or approval before the real state has occurred. Provide reduced-motion behavior and verify bundle impact. Do not add the pack during data migration.

## H. Test and regression plan

Keep the current 26 automated tests unchanged and passing before/after every phase: 16 database, 7 API and 3 auth-callback tests. Add frontend tests around the new shared auth/project context and API adapters, then screen-specific tests for capture/retry, pending state, allowed approval, rejected approval, unknown dates, no-membership state and sign-out.

For every migrated screen run an end-to-end browser check with: assigned administrator/planner, capture → pending → approved L6 actual → reload persistence; and an unassigned account with no project data. Preserve the current live synthetic P-204 record as evidence; do not attempt to overwrite it. Add visual responsive checks only after functional checks pass. Keep prototype mock-data tests/fixtures separate so they cannot masquerade as real-data tests.

## I. Recommended implementation phases in exact order

1. **Foundation seam:** add no visual redesign; define shared TypeScript view models, API adapter/hooks and an authenticated app context alongside the untouched `/workspace` route.
2. **Real Figma login and shell:** place Supabase session and server membership identity around the existing Figma shell. Keep legacy `/workspace` operational; do not migrate content screens yet.
3. **Manual capture parity:** wire the existing Figma capture entry point/drawer to the manual capture API. Remove or plainly label AI simulation in this connected flow. Verify persistence and retry behavior.
4. **Review parity:** wire a connected review-queue variant and drawer to pending events, L6 activity selection and the current approval transaction. Respect current backend roles, including Administrator approval permission.
5. **Schedule and actuals parity:** wire active activities plus verified actuals into Figma schedule/actuals views. Preserve unknown dates and omit unsupported L5 rollups.
6. **Audit parity:** wire the audit screen/feed to supported persisted audit data; avoid unsupported confidence or matching details.
7. **Primary-route cutover:** after the above flow passes live checks, make the authenticated Figma shell the primary path and retain `/workspace` as a temporary fallback.
8. **Responsive acceptance:** apply/review responsive behavior for the already-connected screens; do not expand data scope here.
9. **Brand/motion pack:** integrate approved assets with reduced-motion support after responsive acceptance.
10. **Future backend product phases:** schedule import, correction/conflict workflows, metrics, AI extraction/matching and enterprise integrations only after their own data contracts, validation and human-review boundaries are approved.

## J. Risks and rollback points

| Risk | Control and rollback point |
| --- | --- |
| Prototype role rules conflict with database roles, especially Administrator | Derive roles from `/api/me`; do not use `RoleContext` for live authorization. Retain backend/RLS as final enforcement. Roll back to `/workspace` if a connected Figma action is incorrectly hidden or enabled. |
| UI presents simulated AI as live | Remove that presentation from connected flows until a real AI service and evaluation exist. Keep prototype labels explicit. |
| Mock status names do not match backend state | Introduce adapters; preserve backend labels and do not rename database states. Roll back the screen adapter, not the database or migrations. |
| A partial screen loses evidence, unknown-date handling or idempotency | Treat capture/review as all-or-nothing screen migrations; compare against the `/workspace` flow before cutover. |
| Directly replacing mock screens breaks the presentation prototype | Keep the prototype routes/fixtures untouched until a connected screen is accepted, then migrate via a feature boundary and retain a fallback route. |
| Responsive or asset work obscures functional regressions | Schedule it after functional parity; test current desktop flow first and isolate visual commits. |
| Route change breaks confirmation callbacks/session restoration | Preserve `authCallbackRoute`, `/workspace` callback compatibility and auth regression tests until production route redirects are verified. |
| Scope creep into unsupported features | Dashboard metrics, reports analysis, exceptions, admin management and AI remain sample/placeholder surfaces until real data contracts exist. |

The safest principle is to migrate one complete, currently supported user journey at a time while `/workspace` remains available as a verified rollback path. Backend contracts, RLS, membership checks, approval transaction and current business rules remain unchanged throughout this frontend unification work.
