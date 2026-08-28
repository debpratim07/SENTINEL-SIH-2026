# Implementation milestones

## Foundation — current branch

- Portable Vite build and durable browser routes
- Supabase Auth integration with explicit local demo fallback
- Route-level role enforcement and a shared permission contract
- Versioned Postgres schema, RLS and private Storage policies
- Node API authentication, secure upload initiation/completion and transactional review decisions
- Ingestion queue worker with a plain-text adapter and deterministic candidate ranking
- Canonical development seed, tests and CI

## Vertical slice 1 — schedules and membership

- Authenticated project-schedule query and UI adapter — complete
- Database-backed schedule metrics, hierarchy, filters, detail routes and CSV export — complete
- Administration forms backed by API mutations
- User invitations and project membership management
- Schedule spreadsheet import, validation and publish workflow
- Replace the remaining global-search mock dataset with database queries

## Vertical slice 2 — reports and review

- Connect the existing upload drawer to signed uploads and job status
- Add PDF/table extraction and OCR adapters with page-level provenance
- Replace report, candidate and Review Queue mocks
- Connect accept, correct, reject and clarification actions to the transactional API

## Vertical slice 3 — actuals and exceptions

- Replace actual and exception mocks with verified records
- Progress snapshot calculation and schedule-integrity rules
- Versioned corrections, clarification responses and exception resolution
- Live notifications and audit history

## Vertical slice 4 — intelligence and reporting

- Database-backed dashboard and performance summaries
- Data-quality scoring with explainable inputs
- Execution-pattern learning from accepted decisions
- Exports, integrations, observability and operational runbooks

Each slice retains the approved component layout and replaces one mock workflow end to end. No screen is declared complete until its actions persist, permissions are tested, errors are recoverable and the audit record is visible.
