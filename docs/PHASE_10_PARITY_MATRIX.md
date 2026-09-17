# Phase 10 prototype-to-final parity matrix

Audit date: 17 September 2026

Baseline: `codex/industrial-flow-phase-9` at `87f1881643978a6f98dd4ba27a90ca7149eff79f`.

This is the pre-implementation inventory required before Phase 10 work. The preserved prototype source is the feature reference; the connected Phase 9 application, API, database, authorization rules, and persisted project records are the implementation and truth baseline.

## Evidence reviewed

- Staged `/` login and `/workspace` entry screens.
- Connected shell, routes, dashboard, capture, review, schedule, actuals, audit, administration, authentication, and recovery source.
- Prototype reports, report analysis, upload, exceptions, performance, data-quality, execution-knowledge, search, notification, and guide source.
- Prototype data models and preserved product specifications under `src/imports/pasted_text/`.
- Database migrations, RLS policies, API routes, and all 75 accepted Phase 9 tests.

Authenticated staging screens could not be captured in the audit browser without project credentials. Their structure and behavior were audited from the exact accepted source and baseline tests; authenticated visual acceptance remains a final QA dependency.

## Classification before implementation

| Area | Prototype capability | Phase 9 state | Pre-implementation classification | Phase 10 treatment |
| --- | --- | --- | --- | --- |
| Identity | SENTINEL document/app identity | Browser title and package still say Figma Make App / figma-make-app | PARTIALLY IMPLEMENTED | Replace shipped metadata and scaffold identity with SENTINEL. |
| Authentication | Sign in, session restoration, sign out | Connected Supabase implementation | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Preserve and regression-test. |
| Recovery | Forgot and reset password | Connected Supabase implementation | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Preserve and regression-test. |
| Shell | Industrial responsive shell, theme and reduced motion | Connected Phase 9 implementation | IMPLEMENTED | Preserve and extend. |
| Navigation | Full overview/execution/planning/review/insights/system information architecture | Only connected core routes are exposed | PARTIALLY IMPLEMENTED | Add only connected Phase 10 surfaces with role-aware visibility. |
| Dashboard | Execution, plan, variance, late starts/finishes, reviews, exceptions | Four real counts only | PARTIALLY IMPLEMENTED | Derive deterministic metrics from schedule, verified actuals, and pending events. |
| Dashboard | Plan-versus-actual graph | Present only as mock data | MISSING | Implement milestone-based real series with explicit missing-history limitation. |
| Dashboard | Needs Attention | Present only as mock data | MISSING | Derive actionable conditions and route to real surfaces. |
| Dashboard | Recent Execution | Present only as mock data | MISSING | Build from connected events and verified actuals. |
| Dashboard | Discipline Performance | Present only as mock data | MISSING | Derive by discipline from connected schedule/actual milestones. |
| Capture | Structured manual field capture | Connected and authorized | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Preserve. |
| Capture | Voice input | No final prototype implementation or preserved requirement | NOT FINAL-SCOPE | Do not claim voice support. |
| Reports | Report register, metadata, processing and filters | Mock-only disconnected page | MISSING | Add persisted, project-scoped report ingestion and real register. |
| Ingestion | PDF, DOCX, XLSX, CSV, TXT selection | Simulated upload drawer | MISSING | Implement validated server-side extraction for the supported formats; failures remain visible. |
| OCR | Scanned-document OCR | Preserved prototype specifications explicitly say not to claim real OCR | NOT FINAL-SCOPE | Report as not implemented; text extraction is not OCR. |
| Extraction | Structured candidate events with provenance | Simulated only | MISSING | Add schema-validated candidates, source quote/location, report identity, and review status. |
| AI | Advisory extraction/mapping | Simulated only; no provider configuration | MISSING | Add a server-side provider boundary and safe unavailable state; never auto-verify. |
| Review | Pending/verified queues and evidence inspection | Connected human verification | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Extend to ingested candidates without weakening authority. |
| Exceptions | Conflict, incomplete, unmatched, duplicate views | Mock-only disconnected pages | MISSING | Derive deterministic exceptions from real connected records and document each rule. |
| Schedule | Hierarchy, filters, activities, timeline, details | Connected real data | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Preserve and add real analytics links. |
| Schedule import | Live P6/MS Project connection | Prototype explicitly labels both Not Connected / Future Integration | NOT FINAL-SCOPE | Surface truthful integration status; do not claim P6 or MPP compatibility. |
| Actuals | Verified actual list and detail | Connected real data | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Preserve. |
| Performance | Project and discipline analysis | Mock-only disconnected page | MISSING | Rebuild from deterministic connected analytics. |
| Data Quality | Completeness, matching, evidence and source coverage | Mock-only disconnected page | MISSING | Expose documented component ratios; no arbitrary score. |
| Execution Knowledge | Historical execution patterns | Mock-only disconnected page | MISSING | Build from project-scoped verified records; show insufficient-data states. |
| RAG | Model retrieval over project evidence | No preserved final prototype implementation | NOT FINAL-SCOPE | Deterministic project-scoped retrieval/search is sufficient; do not claim RAG. |
| Search | Activities, actuals, reports, evidence, audit, exceptions, pages | Mock-only global search | MISSING | Search authorized connected records and routes only. |
| Notifications | Attention badges and navigation | Demo in-memory notifications | MISSING | Derive counts/items from real attention conditions. |
| Audit | Persisted project audit and filters | Connected real data | IMPLEMENTED | Extend action labels/details for Phase 10 records. |
| Administration | Team access | Connected real data | IMPLEMENTED | Preserve. |
| Administration | Integration status | Present only in preserved prototype specification | MISSING | Add truthful status without connection claims. |
| Guide | Contextual product guidance | Prototype component not connected | PARTIALLY IMPLEMENTED | Connect concise help to final routes where useful. |
| Responsive | Desktop/tablet/mobile treatment | Phase 9 core routes verified | PARTIALLY IMPLEMENTED | Apply to all restored surfaces and rerun required widths. |
| Accessibility | Keyboard, focus, reduced motion, semantic overlays | Phase 9 core implementation | IMPLEMENTED | Preserve and extend to charts, search, uploads, and new pages. |
| `/workspace` | Connected engineering fallback/reference | Connected and intentionally separate | IMPLEMENTED | Keep functional and do not delete. |

## Metric contract selected for implementation

An L6 activity contributes two equal milestones: planned/actual start and planned/actual finish. For an as-of date, Plan % is the number of non-null planned milestones due on or before that date divided by all non-null planned milestones. Execution % is the number of verified actual milestones dated on or before that date divided by all non-null planned milestones. Variance is Execution % minus Plan %. Unknown planned or actual dates remain unknown and are excluded according to the displayed denominator rules; they are never invented.

Started Late and Finished Late compare verified actual dates with the corresponding planned date only when both are present. Needs Review is the count of persisted pending events. Exceptions are deterministic derived conditions, not arbitrary records.

## Explicit non-final-scope classifications

- Real OCR: explicitly excluded by the preserved prototype specification; ordinary embedded-text extraction must not be described as OCR.
- Voice capture: absent from preserved final prototype behavior.
- Live Primavera P6 and Microsoft Project connections: explicitly labelled Not Connected / Future Integration in the preserved prototype. SENTINEL remains complementary to planning tools.
- Predictive execution forecasting: Execution Knowledge is historical observation, not an automatic forecast.
- Automatic AI verification: prohibited; human verification remains authoritative.

## Post-implementation classification

| Final area | Classification | Evidence / boundary |
| --- | --- | --- |
| SENTINEL identity | IMPLEMENTED | Document title, site metadata, package name, manifest and favicon identify SENTINEL. |
| Authentication, recovery, roles, core shell | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Accepted Phase 9 behavior is retained and regression tests pass. |
| Full connected navigation | IMPLEMENTED | Dashboard, Reports, Actuals, Schedule, Review, Exceptions, Performance, Data Quality, Execution Knowledge, Integrations, Audit and Administration are reachable according to role. |
| Rich Dashboard and drilldowns | IMPLEMENTED | Real milestone KPIs, Plan vs Execution history, attention, recent evidence and discipline performance replace fixture cards. |
| Reports and report analysis | IMPLEMENTED | Project-scoped persisted report register and source/candidate drilldown. No prototype report fixture is imported. |
| PDF/DOCX/XLSX/CSV/TXT ingestion | IMPLEMENTED | Server parsing, validation, size/text limits, SHA-256 provenance and transactional pending-event creation. Hosted migration remains an acceptance dependency. |
| Advisory AI extraction | IMPLEMENTED | Optional server-only provider abstraction with JSON Schema request, strict source/project validation and explicit deterministic fallback. Live-provider acceptance is BLOCKED without provider configuration. |
| Human verification | SUPERSEDED BY REAL CONNECTED IMPLEMENTATION | Extracted candidates enter the accepted Review Queue and cannot update actuals automatically. |
| Exceptions | IMPLEMENTED | Deterministic date-order, missing-actual, unreviewable-event and duplicate-evidence rules. |
| Performance | IMPLEMENTED | Real project/discipline milestone analysis; no mock performance data. |
| Data Quality | IMPLEMENTED | Five transparent component ratios with safe unavailable states. |
| Execution Knowledge | IMPLEMENTED | Historical planned/actual duration samples require verified start and finish pairs; no forecast claim. |
| Search | IMPLEMENTED | Current-project activity, report and evidence retrieval only. |
| Notifications / attention | IMPLEMENTED | Derived current attention conditions route to connected workflows. |
| Audit | IMPLEMENTED | `report_ingested` action and provenance details extend persisted history. |
| Integration status | IMPLEMENTED | A connected capability-status surface exposes exact boundaries without connector claims. |
| OCR | NOT FINAL-SCOPE | Preserved specification excluded real OCR; embedded PDF text extraction is labelled accurately. |
| Voice | NOT FINAL-SCOPE | No final prototype workflow or backend contract was found. |
| RAG | NOT FINAL-SCOPE | No preserved final prototype implementation; project-scoped deterministic retrieval satisfies the represented search workflow. |
| Primavera P6 | NOT FINAL-SCOPE | Prototype marked it Not Connected / Future; no accepted contract or credentials exist. |
| Microsoft Project | NOT FINAL-SCOPE | Prototype marked it Not Connected / Future; no accepted contract or credentials exist. |
| Predictive forecasting | NOT FINAL-SCOPE | Knowledge remains historical evidence, not prediction. |
| Responsive entry surface | IMPLEMENTED | Automated DOM overflow checks pass at all ten required widths and login was visually inspected. Authenticated multi-surface staging browser QA is BLOCKED without credentials/deployment. |
| `/workspace` fallback | IMPLEMENTED | Route remains connected and its obsolete prototype/sample-data messaging was removed. |

## Acceptance blockers

- Migration `004_phase10_ingestion.sql` is not claimed as applied to hosted Supabase because no database-management credential or connector is available in this task.
- No `SENTINEL_AI_*` provider configuration is available, so a controlled live AI call cannot be accepted; mocked boundary tests and deterministic fallback pass.
- The task has no Vercel deployment capability or credentials, so the final branch can be delivered but the requested staging deployment cannot be truthfully claimed.
- Authenticated project credentials are not available to the browser session, so final authenticated staging screenshots and end-to-end upload/review acceptance cannot be performed without modifying hosted data or receiving access.

This matrix will be repeated after implementation with every row moved to an accepted final classification and with blockers named exactly.
