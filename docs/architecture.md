# SENTINEL architecture

## System boundary

The React application owns presentation and interaction. Supabase Auth owns identity, Postgres owns operational records, Supabase Storage owns source documents, and the Node service owns privileged business workflows. The browser never receives server credentials and UI visibility is never treated as authorization.

```text
React ── authentication and RLS reads ── Supabase
  │                                      ├─ Auth
  │                                      ├─ Postgres
  │                                      └─ private Storage
  └── authenticated mutations ── Node API ── ingestion worker
```

## Evidence-to-actual workflow

1. An authorized member requests an upload from the Node API.
2. The API creates report and file records, then returns a short-lived Storage upload URL.
3. The browser uploads directly to the private `project-documents` bucket.
4. The API verifies the stored object and atomically queues an ingestion job.
5. A worker claims the job with `FOR UPDATE SKIP LOCKED`, preserving concurrency safety.
6. The extraction adapter stores source evidence and normalized extracted events.
7. The matching stage records ranked schedule candidates and explanations.
8. Planners or Project Controls review the candidate; machine confidence alone cannot verify an actual.
9. Acceptance creates a verification decision, verified actual and audit event in one transaction.
10. Progress summaries and exception detection consume only verified actuals.

The initial worker includes a real plain-text/CSV adapter and deterministic Postgres trigram candidate ranking. PDF/table/OCR extraction is an adapter boundary and is deliberately not simulated; it must be connected to an approved extraction provider before PDF jobs are enabled in production.

## Authorization

Roles are scoped to a project membership. RLS filters project records at the database boundary. The Node API loads the active membership and checks the shared permission matrix before every mutation. The service role bypasses RLS, so it is restricted to the API/worker environment and every server workflow must perform its own permission check.

## Data integrity

- Schedule imports are versioned and published; baselines are not overwritten.
- Source reports and evidence references are immutable provenance.
- Match candidates are suggestions, not facts.
- A terminal review decision is unique per review item.
- Corrected actuals create versions rather than erasing history.
- Job retries are bounded and locked to prevent duplicate processing.
- Audit events record actor, request, prior value and new value.

## Environments and releases

Development, staging and production use separate Supabase projects and server credentials. Schema changes are migration-only. A pull request must pass types, unit tests, web/API builds and a clean Supabase reset before it can be merged. UI changes also require comparison against the approved Figma reference screenshots.
