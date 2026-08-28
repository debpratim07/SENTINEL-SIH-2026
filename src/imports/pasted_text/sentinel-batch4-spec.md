SENTINEL — BATCH 4 SPECIFICATION
Carry-forward corrections + Report Ingestion + Report Analysis
Keep the existing SENTINEL application, design system, components, branding, typography, light/dark themes, mock-data architecture and interaction patterns.
Batch 1, Batch 2 and Batch 3 are approved structurally.
Do NOT redesign approved screens.
Before building Batch 4, apply the following carry-forward corrections to the existing application.
PART A — CARRY-FORWARD CORRECTIONS
A1 — SIDEBAR
Ensure the expanded desktop sidebar width is exactly:
248px
Collapsed width:
72px
Do not allow the sidebar to consume approximately 300px of workspace.
Keep the global sidebar fixed while page content scrolls.
A2 — REMOVE DUPLICATE SIDEBAR USER PROFILE
Do not show:
Arjun Mehta
Planner
at the bottom-left of the sidebar.
The authenticated user identity already exists in the top-right application header.
Keep user identity only in the global header.
A3 — COLLAPSE CONTROL
Remove the visible text:
Collapse
Replace it with a subtle icon-only chevron control.
Expanded sidebar:
chevron indicates collapse direction.
Collapsed sidebar:
chevron indicates expansion direction.
Requirements:
- visually subtle
- tooltip: “Collapse sidebar” / “Expand sidebar”
- keyboard accessible
- visible focus state
- not styled as a navigation row
- not styled as a primary action
Keep Capture Progress pinned near the bottom of the sidebar.
Final lower sidebar structure:
Navigation
↓
Capture Progress
↓
Subtle collapse/expand chevron
A4 — DASHBOARD PLAN VS ACTUAL
Fix the supporting text:
Verified actuals only
inside Dashboard → Plan vs Actual.
It must be completely contained and readable.
Do not allow clipping or overflow.
Do not otherwise redesign the Dashboard.
PART B — SCHEDULE POLISH
Apply these corrections to both:
Schedule → Activities
and
Schedule → Timeline
without redesigning the Schedule workspace.
B1 — ACTIVITY TYPOGRAPHY
The activity names and hierarchy currently appear too monospace / terminal-like.
Examples include:
PIPING WORKS
AREA B PIPING
ERECT LINE 24-XX
EQUIPMENT ALIGNMENT — P-204
Replace the visibly monospace-looking typography with the approved SENTINEL system sans-serif stack:
-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, sans-serif
Hierarchy names may remain semibold/bold.
Activity IDs may use tabular numeric behavior where useful, but the interface must not resemble code or a terminal.
Preserve hierarchy, indentation and spacing.
B2 — TODAY MARKER
In Schedule → Timeline, retain the current-date vertical marker but add a subtle label:
Today · 28 Aug
Current demo date:
28 Aug 2026
The marker should remain visually restrained.
Do not make it brighter or more prominent than activity information.
B3 — IN-PROGRESS ACTUAL SEMANTICS
Do not visually imply a known Actual Finish when it has not been reported.
For:
ERECT LINE 24-XX
Known truth:
Planned Start:
24 Aug 2026
Actual Start:
26 Aug 2026
Planned Finish:
30 Aug 2026
Actual Finish:
Not reported
Status:
In Progress
Timeline treatment should use:
- a clear verified Actual Start marker at 26 Aug
- a visually differentiated continuation toward the current date if useful
- continuation must be lighter, dashed, translucent or otherwise clearly different from a completed actual-duration bar
- label: In Progress
Tooltip:
Actual Start: 26 Aug 2026
Actual Finish: Not reported
Status: In Progress
Never make the continuation look like a verified Actual Finish.
B4 — ACTUAL BARS MUST REPRESENT KNOWN DATA
Do not display a solid orange Actual duration bar unless SENTINEL has verified information supporting that duration.
For activities such as:
P-204 INSTALLATION
do not invent a verified start-to-finish execution duration merely to populate the Timeline.
If only an Actual Start is known:
show an Actual Start marker.
If no verified Actual exists:
show:
No actual reported
If actual data is AI Suggested but not verified:
use the existing purple suggested/unverified treatment.
Missing is not zero.
Suggested is not verified.
B5 — SCHEDULE VERTICAL SCROLLING
Fix the current Schedule scrolling issue.
The user must be able to scroll below Civil Works and access the entire schedule hierarchy.
The main Schedule workspace body must support vertical scrolling.
Requirements:
- global top header remains fixed
- global left sidebar remains fixed
- Schedule page header/tabs may remain sticky where appropriate
- activity/timeline body scrolls vertically
- no lower activity groups may be clipped
- all disciplines and activities must remain reachable
- do not lock the timeline body to viewport height without overflow
- Activities and Timeline tabs must both support the complete hierarchy
- frozen activity-name column must stay vertically aligned with timeline rows
- use native/smooth scrolling
- use a restrained system scrollbar
- avoid a visually heavy permanent scrollbar
The layout must continue working on shorter laptop screens.
Do not solve this by shrinking rows until they become unreadable.
PART C — BUILD BATCH 4 ONLY
Now build:
REPORT INGESTION + REPORT ANALYSIS
Create only these new functional surfaces:
1. Upload Report
2. Upload validation
3. Report processing state
4. Report processing result
5. Reports page
6. Report Analysis page
7. Original Source document panel
8. Source Evidence viewer
9. Source ↔ Actual highlighting
10. Extracted Actual Event list
11. Per-event schedule match review
12. Eligible bulk review / verification
Do NOT build yet:
- Exceptions
- full Actuals workspace
- Performance
- Data Quality
- Execution Knowledge
- Audit Log
- Administration
- Login
Reuse existing components wherever possible.
In particular, reuse the existing Batch 2:
Review Match
patterns instead of inventing another review system.
CORE REPORT WORKFLOW
The workflow must communicate:
REPORT
↓
SOURCE EVIDENCE
↓
EXECUTION STATEMENTS
↓
STRUCTURED ACTUAL EVENTS
↓
SCHEDULE CANDIDATES
↓
CONFIDENCE / REVIEW STATE
↓
HUMAN VALIDATION
↓
VERIFIED ACTUALS
Important:
One Report can create multiple Actual Events.
Report and Actual Event are separate entities.
Report processing status and Actual verification status are separate concepts.
A successfully processed report must NOT imply that all extracted Actual Events are verified.
UPLOAD REPORT ENTRY POINT
Make the existing:
Capture Progress → Upload Report
option functional.
Open a large right-side drawer or focused overlay consistent with the existing Capture Progress experience.
Title:
Upload Report
Supporting text:
Add a field report and SENTINEL will identify execution events and connect them to the project schedule.
UPLOAD AREA
Show:
Drop a report here
or
Browse files
Supported prototype formats:
PDF
DOCX
XLSX
CSV
TXT
Do not claim production-grade OCR.
Scanned site diaries may be represented in prototype form, but do not imply perfect OCR capability.
Use the demo file:
Piping_DPR_28Aug.pdf
Display:
PDF
2.4 MB
REPORT METADATA
Show optional/pre-populated context:
Discipline
Piping
Report Date
28 Aug 2026
Area
Area B
Actions:
Cancel
Analyze Report
Analyze Report uses the existing primary gradient CTA.
VALIDATION STATE
Before analysis show:
Piping_DPR_28Aug.pdf
✓ File readable
✓ Supported format
✓ Project context available
Allow processing to continue.
Also support a prototype failure state:
Unable to process this file
Supporting text:
The uploaded file is corrupted or unsupported.
Actions:
Choose Another File
Cancel
Do not expose stack traces or technical exceptions.
PROCESSING STATE
After Analyze Report:
Analyzing Report
Piping_DPR_28Aug.pdf
Use a restrained sequence:
✓ Reading source
✓ Identifying execution statements
✓ Structuring actual events
→ Matching schedule activities
○ Checking completeness
Do not show fake progress percentages.
Do not write:
AI is thinking
Do not use chat bubbles.
PROCESSING RESULT
Use this fixed result:
Report processed
6 Actual Events identified
4 Strong Matches
1 Needs Review
1 Incomplete
Supporting text:
Each execution event is evaluated independently before it can affect schedule truth.
Actions:
Review Report
Done
Do NOT say:
6 activities verified
or imply automatic schedule updates.
REPORTS PAGE
Make the existing Reports sidebar navigation functional.
Header:
Reports
Supporting text:
Review uploaded field reports and the execution events extracted from them.
Toolbar:
Search reports...
Discipline ▾
Area ▾
Date ▾
Processing Status ▾
Right-side action:
Upload Report
REPORTS TABLE
Columns:
REPORT
DATE
DISCIPLINE
AREA
ACTUALS FOUND
PROCESSING STATUS
REVIEW STATE
Primary demo row:
Piping_DPR_28Aug.pdf
28 Aug 2026
Piping
Area B
6 Actuals
Processing Status:
Processed
Review State:
2 require attention
Processed must not look equivalent to Verified.
Click the report row to open Report Analysis.
A few lightweight supporting rows may be added if required visually, but do not generate unnecessary fake datasets.
REPORT ANALYSIS PAGE
Use a full page.
Breadcrumb:
Reports / Piping_DPR_28Aug.pdf
Header:
Piping_DPR_28Aug.pdf
Supporting metadata:
Piping · Area B · 28 Aug 2026
Processing Status:
Processed
Summary:
6 Actual Events
4 Strong Matches
1 Needs Review
1 Incomplete
Actions:
View Original
Upload New Version
Upload New Version may remain visual-only in this prototype.
REPORT ANALYSIS LAYOUT
On desktop use approximately:
45% — SOURCE DOCUMENT
55% — EXTRACTED ACTUALS
This should be one of SENTINEL's strongest operational workflows.
The user must be able to see the connection between:
what the source actually said
and
what SENTINEL structured.
ORIGINAL SOURCE DOCUMENT
Represent:
DAILY PROGRESS REPORT
28 AUG 2026
AREA B — PIPING
Source statements:
1. Spool erected for Line 24-XX. Final bolt tightening pending.
2. Pipe supports installed for Line 24-XX at grid B4.
3. Hydrotest preparation commenced for Line 18-AB.
4. Line 31-ZZ fabrication completed at fabrication yard.
5. Material shifting carried out near Area B.
6. Welding work started. Location confirmation pending.
Preserve these statements exactly as source evidence.
Do not silently rewrite or “improve” source wording.
SOURCE ↔ ACTUAL HIGHLIGHTING
This interaction is mandatory.
When the user hovers or selects an Actual Event on the right:
highlight its corresponding source statement on the left.
When the user selects the relevant source statement on the left:
select/highlight its corresponding Actual Event on the right.
Use restrained SENTINEL orange highlighting.
Avoid bright fluorescent yellow.
Use an additional structural indicator such as:
- left edge marker
- underline
- linked icon
- selected state
so the connection is not communicated using color alone.
EVENT 1 — STRONG MATCH
Actual ID:
ACT-2026-0842
Original statement:
“Spool erected for Line 24-XX. Final bolt tightening pending.”
Structured Actual:
Activity:
Spool erection
Event:
Actual Start
Date:
28 Aug 2026
Discipline:
Piping
Area:
Area B
Line:
24-XX
Suggested Schedule Match:
ERECT LINE 24-XX
L6 · Piping · Area B
Confidence:
96%
Classification:
Strong Match
Important:
Strong Match is still an AI confidence state.
Do NOT label the relationship Verified until a human reviewer verifies it.
EVENT 2
Original:
“Pipe supports installed for Line 24-XX at grid B4.”
Activity:
Pipe support installation
Event:
Actual Finish
Suggested:
INSTALL PIPE SUPPORT 24-XX
Confidence:
94%
Status:
Strong Match
EVENT 3
Original:
“Hydrotest preparation commenced for Line 18-AB.”
Activity:
Hydrotest preparation
Event:
Actual Start
Suggested:
HYDROTEST LINE 18-AB
Confidence:
92%
Status:
Strong Match
EVENT 4
Original:
“Line 31-ZZ fabrication completed at fabrication yard.”
Activity:
Line fabrication
Event:
Actual Finish
Suggested:
FABRICATE LINE 31-ZZ
Confidence:
95%
Status:
Strong Match
EVENT 5 — NEEDS REVIEW
Original:
“Material shifting carried out near Area B.”
Activity:
Material shifting
Event:
Progress Update
Area:
Area B
Suggested Candidate:
MATERIAL HANDLING — AREA B
Confidence:
58%
Status:
Needs Review
The terminology is broad and ambiguous.
Do not force a schedule relationship.
EVENT 6 — INCOMPLETE
Original:
“Welding work started. Location confirmation pending.”
Activity:
Welding
Event:
Actual Start
Area:
Not reported
Specific Line:
Not reported
Suggested Match:
No reliable match
Status:
Incomplete
Preserve the Actual Event.
Do not discard it simply because matching failed.
EVENT CARD / ROW DESIGN
Keep event presentation moderately dense.
Do not use six huge dashboard cards.
Each item should expose enough information to scan:
Actual ID
Original statement
Event Type
Activity
Discipline / Area
Suggested Schedule Activity
Confidence
Status
Allow details to expand progressively.
EVENT DETAIL
When an event is expanded, preserve this exact information order:
1. Source Evidence
2. Structured Actual
3. Suggested Schedule Match
4. Confidence
5. Matching Signals
6. Alternative Candidates
7. Human Action
Evidence must appear before the AI recommendation.
MATCHING SIGNALS
For ERECT LINE 24-XX show:
Line Reference
Strong
Discipline
Match
Area
Match
Terminology
Strong
Hierarchy
Compatible
Concise explanation:
Line reference, discipline, area and reported execution terminology align strongly with this schedule activity.
Do not expose hidden reasoning or chain-of-thought.
EVENT ACTIONS
Strong, complete match:
Review Match
Needs Review:
Review Individually
Incomplete:
Request Clarification
Do not bulk-verify low-confidence or incomplete records.
Reuse the existing Review Match interaction where appropriate.
BULK REVIEW ELIGIBILITY
Only strong, complete and policy-eligible events can be selected.
Example:
☑ ERECT LINE 24-XX — 96%
☑ INSTALL PIPE SUPPORT 24-XX — 94%
☑ HYDROTEST LINE 18-AB — 92%
☑ FABRICATE LINE 31-ZZ — 95%
Material shifting — 58%
must NOT be selectable for bulk verification.
Welding work — Incomplete
must NOT be selectable for bulk verification.
For ineligible items provide a tooltip:
This item requires individual review.
BULK ACTION BAR
When eligible records are selected show:
4 selected
Review Selected
Clear
Do not immediately use a one-click:
Verify All
workflow.
The user must first see the proposed relationships.
BULK CONFIRMATION
Title:
Review Selected Matches
Supporting text:
4 strong schedule matches are ready for verification.
Show a concise mapping list:
Actual Event
→
Schedule Activity
Confidence
Actions:
Cancel
Verify 4 Matches
Supporting note:
Verified relationships will become trusted schedule-linked actuals.
BULK SUCCESS
After verification:
4 matches verified
Update the report summary logically:
4 Verified
1 Needs Review
1 Incomplete
Do not mark the entire report Verified.
Report processing status remains:
Processed
REPORT STATUS MODEL
Report processing statuses:
Uploaded
Processing
Processed
Processing Failed
Actual/review statuses:
AI Suggested
Strong Match
Needs Review
Incomplete
Verified
Unmatched
Awaiting Clarification
These are separate systems.
Example:
Report:
Processed
Actual Events:
4 Verified
1 Needs Review
1 Incomplete
is valid.
EVIDENCE VIEWER
Make View Original functional.
Open:
Source Evidence
Piping_DPR_28Aug.pdf
Metadata:
Uploaded:
28 Aug 2026 · 08:31
Report Date:
28 Aug 2026
Discipline:
Piping
Area:
Area B
Pages:
3
Support prototype page navigation.
If opened from an Actual Event, automatically highlight the relevant source passage.
Evidence is immutable.
Do not create document editing controls.
TRACEABILITY
Where useful expose lightweight lineage:
Piping_DPR_28Aug.pdf
↓
Source Statement
↓
ACT-2026-0842
↓
ERECT LINE 24-XX
↓
Planner Verification
This does not need to become a separate page.
TRUST RULES
These rules are mandatory:
1. Original report evidence is preserved.
2. Report processing does not equal verification.
3. One report can generate multiple Actual Events.
4. Each Actual Event is matched independently.
5. AI confidence does not equal human approval.
6. Missing information is never fabricated.
7. Incomplete Actual Events remain stored.
8. Human verification follows project review policy.
9. Source ↔ Actual traceability remains visible.
10. A human override never erases the original AI suggestion.
11. Only verified Actual Events may update official schedule truth.
12. “Final bolt tightening pending” must never be interpreted as Actual Finish.
13. Missing is not zero.
14. Suggested is not verified.
15. Source evidence remains immutable.
VISUAL DIRECTION
Reuse the existing approved SENTINEL visual system.
Report Analysis should feel:
precise
evidence-driven
operational
high-trust
moderately dense
Use:
Apple clarity
-
professional project-controls density
Avoid:
giant cards
generic chatbot UI
AI avatars
large decorative file illustrations
excessive orange
neon
cyberpunk AI imagery
generic document-management styling
excessive pills
spreadsheet overload
The original source document should remain visually important.
LIGHT / DARK MODE
The entire new workflow must support both existing SENTINEL themes.
In dark mode:
- use charcoal surfaces, not pure black
- maintain readable document contrast
- source highlighting remains visible
- confidence/status states remain distinguishable
- do not oversaturate orange
Do not create separate visual systems for light and dark mode.
RESPONSIVE BEHAVIOR
Desktop:
Source + Actuals split view.
Tablet:
Allow Source Evidence to collapse into a dedicated evidence panel.
Mobile:
Do not squeeze the desktop split view onto the screen.
Use:
Evidence | Actuals
tabs.
Actual Event items become full-width.
Verification actions remain accessible.
ACCESSIBILITY
Maintain:
keyboard navigation
visible focus states
semantic upload control
accessible drag/drop alternative
accessible file errors
focus trapping inside overlays
source highlighting not communicated only through color
status text in addition to status color
proper contrast
keyboard-accessible Actual selection
FINAL BUILD RULE
Build ONLY:
Upload Report
Reports
Report Analysis
Source Evidence Viewer
Source ↔ Actual highlighting
Report-event review interactions
and the carry-forward corrections at the beginning of this specification.
Reuse existing Batch 2 review components.
Do not redesign Batch 1, Batch 2 or Batch 3.
Do not build:
Exceptions
full Actuals
Performance
Data Quality
Execution Knowledge
Audit Log
Administration
Login
Do not add:
backend
database
real OCR integration
real Primavera integration
chatbot