SENTINEL — BATCH 5
Carry-forward Schedule polish + Actuals + Exceptions
Keep the existing SENTINEL application exactly as currently designed.
Batch 1 through Batch 4 are approved structurally.
Preserve the existing:
- SENTINEL branding and exact supplied logo
- application shell
- light and dark themes
- typography
- sidebar
- Dashboard
- Capture Progress
- Log with SENTINEL
- Review Queue
- Review Match
- Schedule Activities
- Schedule Activity Detail
- Schedule Timeline
- Upload Report
- Reports
- Report Analysis
- Evidence interactions
- reusable components
- mock-data architecture
Do NOT redesign approved screens.
Build ONLY the carry-forward correction below and Batch 5.
PART A — CARRY-FORWARD SCHEDULE CORRECTION
FIX TIMELINE CURRENT-DATE LABEL
The Schedule Timeline currently displays overlapping text around the current-date marker.
The interface is showing:
Today · 28 Aug
and
28 Aug
in approximately the same position.
This creates visually broken overlapping text.
Fix this permanently.
At the current-date position, show only ONE clean current-date label:
Today · 28 Aug
Requirements:
- suppress the normal 28 Aug tick label when Today · 28 Aug occupies the same position
- alternatively reposition the normal timeline tick only if needed, but never allow the two labels to overlap
- preserve surrounding timeline ticks such as 22 Aug and 5 Sep
- keep the vertical Today line subtle
- align Today · 28 Aug clearly with the current-date vertical line
- do not duplicate date text
- maintain correct behavior in light and dark mode
- keep the label readable at different desktop widths
Do NOT redesign the Schedule Timeline.
Preserve all previously implemented Schedule fixes including:
- vertical Schedule scrolling
- synchronized activity/timeline scrolling
- P-204 conflict treatment
- exact-activity hover information
- non-monospace activity typography
- in-progress actual semantics
- no fabricated Actual Finish
PART B — BUILD BATCH 5
Build ONLY:
ACTUALS + EXCEPTIONS
Create these new functional surfaces:
1. Actuals page
2. Actual Detail
3. Actual filtering/search
4. Actual trust/status states
5. Exceptions page
6. Exception Detail / Resolution surface
7. Conflict Resolution
8. Incomplete Actual handling
9. Unmatched Actual handling
10. Duplicate handling
11. Request Clarification
12. Keep Unmatched
13. Flag for Schedule Review
14. Resolution confirmation and history
Do NOT build yet:
- Performance
- Data Quality
- Execution Knowledge
- Audit Log
- Administration
- Login
- Global Search
- Notifications
- Profile
- SENTINEL Guide
CORE ENTITY RULE
Maintain strict separation between:
REPORT
ACTUAL EVENT
SCHEDULE ACTIVITY
MATCH CANDIDATE
REVIEW DECISION
SCHEDULE UPDATE
An Actual Event represents what happened in the field.
It must remain accessible even when:
- no schedule match exists
- its data is incomplete
- evidence conflicts
- a duplicate is detected
- the schedule requires review
Never delete field truth merely because reconciliation fails.
ACTUALS PAGE
Make the existing:
Actuals
sidebar item functional.
Header:
Actuals
Supporting text:
Structured field execution events captured across the project.
Right-side action:
Capture Progress
Use the existing primary action pattern.
ACTUALS SUMMARY
Show compact inline metrics rather than large Dashboard KPI cards:
1,042 Actual Events
927 Verified
37 Needs Review
18 Incomplete
12 Exceptions
48 Unmatched
These are prototype/demo values.
Official project schedule metrics must continue to use verified Actuals only.
ACTUALS TOOLBAR
Include:
Search actuals...
Event Type ▾
Discipline ▾
Area ▾
Status ▾
Source ▾
Date ▾
Sort ▾
Include:
Clear Filters
Filters should work with centralized mock state.
ACTUALS TABLE
Use a moderately dense professional table.
Columns:
ACTUAL
EVENT
DISCIPLINE
AREA
DATE
SOURCE
SCHEDULE LINK
TRUST / STATUS
Primary demo rows should include existing SENTINEL entities.
ACTUAL ROW 1
ACT-2026-0842
Activity:
Spool erection
Event:
Actual Start
Date:
26 Aug 2026
Discipline:
Piping
Area:
Area B
Source:
Supervisor Update
Schedule Link:
ERECT LINE 24-XX
Status:
Verified
Reviewed by:
Arjun Mehta
ACTUAL ROW 2
Activity:
Pump P-204 alignment
Event:
Actual Start
Discipline:
Rotating Equipment
Area:
Utility Block
Source:
Supervisor Update
Schedule:
EQUIPMENT ALIGNMENT — P-204
Status:
Conflict
Do not display a single resolved date.
ACTUAL ROW 3
Activity:
Foundation work
Discipline:
Civil
Schedule:
FOUNDATION BLOCK C-14
Status:
Needs Review
ACTUAL ROW 4
Activity:
Cable tray installation
Discipline:
Electrical
Area:
Utility Block
Actual Start:
Not reported
Status:
Incomplete
ACTUAL ROW 5
Activity:
Material shifting
Area:
Area B
Schedule Link:
Not linked
Status:
Unmatched
ACTUAL STATUS LANGUAGE
Support:
Verified
AI Suggested
Needs Review
Incomplete
Unmatched
Conflicting
Awaiting Clarification
Duplicate
Do not make these giant colorful pills.
Use restrained badges, icons and text.
Verified is human-approved.
AI Suggested is not Verified.
Missing information must say:
Not reported
not:
0
ACTUAL ROW INTERACTION
Clicking an Actual opens:
Actual Detail
Use a full page because Actual Events are core execution entities.
Breadcrumb example:
Actuals / ACT-2026-0842
ACTUAL DETAIL HEADER
For ACT-2026-0842:
Spool erection
ACT-2026-0842
Actual Start · Piping · Area B
Status:
Verified
Linked Schedule Activity:
ERECT LINE 24-XX
Primary contextual actions:
View Schedule Activity
View Source Evidence
Do not make an Edit button the dominant action for verified Actuals.
ACTUAL DETAIL INFORMATION ORDER
Use this information hierarchy:
1. Execution Summary
2. Original Evidence
3. Structured Actual
4. Schedule Relationship
5. Trust / Review
6. Source Context
7. History
Evidence and execution truth must remain prominent.
EXECUTION SUMMARY
Show:
Activity:
Spool erection
Event:
Actual Start
Actual Date:
26 Aug 2026
Discipline:
Piping
Area:
Area B
Line Reference:
24-XX
Status:
Verified
ORIGINAL EVIDENCE
Show:
“Spool erected in Area B. Final bolt tightening pending.”
Source:
Supervisor Update
Reported:
26 Aug 2026 · 08:42
Actions:
View Full Evidence
If originating from a report, link to the exact source passage.
Never rewrite the original field wording.
STRUCTURED ACTUAL
Show structured fields separately from the original wording.
If a field was inferred, mark:
Inferred
If missing, show:
Not reported
Do not fill gaps automatically.
SCHEDULE RELATIONSHIP
Show:
ERECT LINE 24-XX
L6 · Piping · Area B
Relationship:
Verified
Historical AI Confidence:
91%
Important:
Keep these two concepts visually separate.
Human Verification:
Verified
AI Confidence:
91%
Do NOT show:
91% Verified
as one merged state.
REVIEW INFORMATION
Show:
Reviewed By:
Arjun Mehta
Review Date:
28 Aug 2026 · 10:44
Decision:
Accepted Suggested Match
Original AI Suggestion:
ERECT LINE 24-XX
Confidence:
91%
This history remains even if humans later modify the relationship.
ACTUAL HISTORY
Show concise timeline:
26 Aug · 08:42
Actual captured
26 Aug · 08:43
Schedule candidate suggested
ERECT LINE 24-XX · 91%
28 Aug · 10:44
Match verified
Arjun Mehta
28 Aug · 10:44
Schedule Actual Start updated
Do not expose internal chain-of-thought.
EXCEPTIONS PAGE
Make the existing:
Exceptions
sidebar item functional.
Header:
Exceptions
Supporting text:
Resolve execution records that cannot safely update schedule truth.
Show compact counts:
3 Open
1 Conflict
1 Incomplete
1 Unmatched
Do NOT create giant KPI cards.
EXCEPTION TYPES
Primary exception types:
Conflicting
Incomplete
Unmatched
Duplicate
Support internally if useful:
Granularity Mismatch
but it does not need to become a major top-level filter in this prototype.
EXCEPTION WORKFLOW STATUS
Exception Type and Workflow Status are separate.
Workflow statuses:
Open
Under Review
Awaiting Clarification
Resolved
Kept Unmatched
Flagged for Schedule Review
Do not confuse:
Conflict
with:
Open
One is the problem type.
One is the resolution workflow state.
EXCEPTIONS TOOLBAR
Include:
Search exceptions...
Type ▾
Discipline ▾
Area ▾
Workflow Status ▾
Source ▾
Sort ▾
EXCEPTIONS TABLE
Columns:
EXCEPTION
TYPE
ACTUAL
DISCIPLINE
AREA
SOURCE
WORKFLOW STATUS
OWNER
Primary rows:
EQUIPMENT ALIGNMENT — P-204
Type:
Conflicting
Discipline:
Rotating Equipment
Area:
Utility Block
Status:
Open
Welding work started
Type:
Incomplete
Area:
Not reported
Status:
Awaiting Clarification
Material shifting near Area B
Type:
Unmatched
Status:
Open
EXCEPTION DETAIL PRINCIPLE
Every exception detail must immediately answer three questions:
WHAT HAPPENED?
WHY IS THIS A PROBLEM?
WHAT CAN I DO?
These three questions should drive the layout.
Do not bury resolution controls below excessive metadata.
CONFLICT EXCEPTION — HERO DEMO
Use:
EQUIPMENT ALIGNMENT — P-204
Exception Type:
Conflicting Actual Start
Workflow Status:
Open
Actual:
Pump P-204 alignment
Discipline:
Rotating Equipment
Area:
Utility Block
Schedule Candidate:
EQUIPMENT ALIGNMENT — P-204
WHAT HAPPENED
Show both conflicting evidence records.
SOURCE 1
“Pump P-204 alignment started this morning.”
Reported:
26 Aug 2026
Source:
Supervisor Update
SOURCE 2
“Alignment of Pump P-204 commenced today.”
Reported:
27 Aug 2026
Source:
Daily Progress Report
Do not merge these into one date automatically.
WHY THIS IS A PROBLEM
Show:
Two trusted field sources report different Actual Start dates for the same activity.
Current conflicting values:
26 Aug 2026
27 Aug 2026
Schedule update:
Blocked
Supporting note:
SENTINEL will not update the official Actual Start until the conflict is resolved.
CONFLICT RESOLUTION ACTIONS
Offer:
Use 26 Aug
Use 27 Aug
Request Clarification
Keep Conflict Open
Do NOT automatically recommend one as fact.
If SENTINEL has supporting confidence/context, it may show:
Suggested Resolution
but it must remain clearly advisory.
Human decision is required.
SELECT DATE CONFIRMATION
If planner chooses:
Use 26 Aug
show confirmation:
Resolve Actual Start Conflict?
Selected Actual Start:
26 Aug 2026
Preserved Evidence:
26 Aug source
27 Aug source
Supporting text:
Both source records will remain in the evidence history.
Actions:
Cancel
Resolve Conflict
After resolution:
Actual Start:
26 Aug 2026
Status:
Verified
Exception:
Resolved
Decision By:
Arjun Mehta
Schedule update may then proceed.
Never delete the losing source.
INCOMPLETE EXCEPTION
Use:
“Welding work started. Location confirmation pending.”
What happened:
Activity:
Welding
Event:
Actual Start
Area:
Not reported
Specific Line:
Not reported
Why problem:
There is insufficient context to safely identify the related L5/L6 schedule activity.
Actions:
Request Clarification
Add Context
Keep Incomplete
REQUEST CLARIFICATION
Open a compact modal/drawer:
Request Clarification
Question:
Which project area and line does this welding activity refer to?
Recipient:
Original Reporter
Actions:
Cancel
Send Request
After sending:
Workflow Status:
Awaiting Clarification
The Actual remains stored.
Do not delete it.
ADD CONTEXT
Authorized planner/project-controls users may manually add known context.
Fields:
Area
Line Reference
Optional Comment
Do not silently overwrite original evidence.
Show additions as:
Planner-added context
and preserve who added it and when.
After new context is provided:
Re-run Match
can be a prototype interaction.
UNMATCHED EXCEPTION
Use:
Material shifting near Area B
Actual:
Material shifting
Area:
Area B
Suggested candidate:
MATERIAL HANDLING — AREA B
Historical Confidence:
58%
Current Relationship:
Unmatched
WHY UNMATCHED
Show:
No candidate reached the project's safe matching threshold.
Possible reasons:
Broad activity terminology
No specific equipment/line reference
Multiple possible schedule activities
Do not force a relationship.
UNMATCHED ACTIONS
Offer:
Choose Schedule Activity
Keep Unmatched
Request Clarification
Flag for Schedule Review
KEEP UNMATCHED
Confirmation:
Keep this Actual unmatched?
Supporting text:
The execution event will remain in SENTINEL but will not update the project schedule.
Optional Comment
Cancel
Keep Unmatched
After action:
Workflow Status:
Kept Unmatched
The Actual remains searchable in Actuals.
FLAG FOR SCHEDULE REVIEW
Use when the field execution appears valid but the schedule may not contain an appropriate corresponding activity.
Confirmation:
Flag for Schedule Review
Supporting text:
This execution record may indicate a planning or schedule-structure gap.
Optional Comment
Actions:
Cancel
Flag for Review
Result:
Workflow Status:
Flagged for Schedule Review
Do not fabricate a new schedule activity.
CHOOSE SCHEDULE ACTIVITY
Reuse the existing Batch 2 schedule-selection modal.
Search:
activity ID or description
Show:
candidate activity
level
discipline
area
planned dates
If planner manually selects a different activity, preserve:
Original AI Recommendation
Historical Confidence
Planner Selected Activity
Reviewer
Timestamp
Never overwrite AI history.
DUPLICATE EXCEPTION
Support duplicate handling.
Example:
Two records describe the same field event.
Do NOT delete one record automatically.
Show:
Possible Duplicate
Actual A
Actual B
Evidence A
Evidence B
Matching signals:
same equipment
same activity
similar time
same area
DUPLICATE RESOLUTION
Actions:
Merge Evidence
Not a Duplicate
Keep Separate
Preferred resolution behavior:
Merge Evidence
means:
one canonical Actual Event
-
both original source evidence records remain attached.
Do not destroy either source.
Do not silently erase audit history.
DUPLICATE CONFIRMATION
Title:
Merge duplicate execution records?
Supporting text:
Both source records will be preserved as evidence under a single canonical Actual Event.
Actions:
Cancel
Merge Evidence
After merge:
Canonical Actual retained
2 source evidence records
Duplicate exception resolved
EXCEPTION RESOLUTION HISTORY
Every resolved exception should show:
Problem Type
Original Values
Decision
Decision By
Decision Date
Comment
Schedule Impact
Preserved Evidence
Resolution must remain auditable.
EXCEPTION DETAIL LAYOUT
Prefer a large right-side drawer or dedicated detail workspace depending on information density.
For the hero Conflict resolution, use enough width to compare evidence comfortably.
Do not use tiny modal dialogs for the entire exception-resolution process.
Small confirmation dialogs are fine after the user chooses an action.
CROSS-LINKING
From Actual Detail:
View Exception
if an exception exists.
From Exception Detail:
View Actual
View Schedule Activity
View Source Evidence
From Schedule Activity Detail:
show unresolved exception indicator when applicable.
Do not create isolated information silos.
DATA CONSISTENCY
Continue using the existing demo truth.
ERECT LINE 24-XX:
Planned Start:
24 Aug 2026
Verified Actual Start:
26 Aug 2026
Planned Finish:
30 Aug 2026
Actual Finish:
Not reported
Status:
In Progress
EQUIPMENT ALIGNMENT — P-204:
Conflicting Actual Start evidence:
26 Aug 2026
27 Aug 2026
Do NOT decide a final value until the Conflict workflow resolves it.
FOUNDATION BLOCK C-14:
Needs Review
CABLE TRAY INSTALLATION — UTILITY BLOCK:
Actual Start:
Not reported
TRUST RULES
Mandatory across Actuals and Exceptions:
1. Original evidence must always be preserved.
2. Missing information is never invented.
3. Verified means human-approved.
4. AI confidence does not equal approval.
5. Conflict preserves every source.
6. Duplicate resolution merges evidence rather than destroying evidence.
7. Unmatched Actuals remain valid execution records.
8. Incomplete Actuals remain stored.
9. Schedule truth updates only after required validation.
10. Planner-added context must be distinguishable from original field evidence.
11. AI history must survive human overrides.
12. Every resolution records reviewer identity and timestamp.
13. Missing is not zero.
14. “Final bolt tightening pending” is not Actual Finish.
15. Exceptions must block unsafe schedule updates where appropriate.
VISUAL DIRECTION
Reuse the existing SENTINEL visual system.
Actuals should feel:
structured
operational
searchable
trustworthy
Exceptions should feel:
focused
decision-oriented
evidence-driven
serious
Do not make Exceptions look like a red-alert emergency dashboard.
Most exceptions are workflow/data-reconciliation issues, not safety emergencies.
Use red specifically for true conflicts/error states.
Use purple for review/suggested states.
Use neutral treatment for incomplete/unmatched states.
Use green carefully for verified/resolved.
Keep orange for SENTINEL brand/action emphasis.
Avoid excessive status pills.
DARK MODE
Support the existing dark theme.
Do not use pure black.
Evidence comparison must remain readable.
Conflict sources must remain distinguishable.
Do not make red overly saturated.
RESPONSIVE
Desktop:
professional tables + detail drawer/page.
Tablet:
hide lower-priority table columns.
Mobile:
Actuals and Exceptions become compact cards.
Exception evidence comparisons stack vertically.
Sticky resolution actions remain accessible.
Do not squeeze desktop tables into tiny mobile widths.
ACCESSIBILITY
Maintain:
keyboard navigation
semantic tables
accessible filters
visible focus states
tooltips for icon-only actions
text labels in addition to status color
focus trapping in modals/drawers
keyboard-accessible resolution actions
confirmation before consequential verification/resolution
FINAL RULE
Build ONLY:
Actuals
Actual Detail
Exceptions
Exception Detail
Conflict Resolution
Incomplete handling
Unmatched handling
Duplicate handling
Clarification / Schedule Review interactions
and the single Schedule Timeline current-date label correction at the beginning.
Do NOT create later-batch pages.
Do NOT add backend/database functionality.
Do NOT add a chatbot.
Do NOT redesign existing approved workflows.
Stop when Batch 5 is complete.