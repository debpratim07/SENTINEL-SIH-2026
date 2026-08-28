SENTINEL — FINAL QA, POLISH & DEMO-READINESS PASS
The SENTINEL product is feature-complete.
Batches 1–7 are approved structurally.
This is NOT a new feature batch.
Do NOT redesign the application.
Do NOT add new modules.
Do NOT change the established product architecture.
Your task is to perform a comprehensive final quality pass across the existing SENTINEL prototype, apply all remaining corrections below, remove inconsistencies, enforce role permissions, fix navigation and responsive issues, and make the product presentation-ready for the Smart India Hackathon demo.
Preserve the exact supplied SENTINEL logo, existing design system, primary brand colors, typography direction, application structure, reusable components, light/dark themes, core workflows and trusted demo dataset.
The final product should feel:
premium
calm
precise
high-trust
industrial-professional
moderately dense
Visual direction:
Apple clarity + professional project-controls density.
Do not turn this into a generic SaaS dashboard, ERP interface or AI chatbot product.
1 — FINAL GLOBAL SHELL
Preserve the existing application shell.
Expanded desktop sidebar:
248px
Collapsed:
72px
Keep:
global header fixed
sidebar fixed
page content correctly offset beneath the global header
page-specific content vertically scrollable
subtle collapse/expand chevron
Do NOT restore:
bottom sidebar user profile
visible “Collapse” text
2 — ROLE-AWARE SIDEBAR SECTION VISIBILITY
This applies to EVERY role.
Sidebar section headings must render only when the active role has at least one visible navigation item inside that section.
Sections:
OVERVIEW
EXECUTION
PLANNING
REVIEW
INSIGHTS
SYSTEM
If a role has zero permitted items inside a section:
hide the section heading
hide the empty space belonging to that section
reflow the remaining navigation naturally.
Never show:
SYSTEM
with nothing underneath it.
Never show any other empty heading either.
Example:
Project Manager does not have Audit Log or Administration.
Therefore:
SYSTEM must disappear entirely.
Apply the same logic to:
Site Supervisor
Discipline Engineer
Planner
Project Controls
Project Manager
Administrator
Do not hard-code this only for Project Manager.
3 — ROLE-AWARE BOTTOM ACTIONS
The global:
Capture Progress
action must only appear for roles that are allowed to capture execution.
Site Supervisor:
show
Discipline Engineer:
show if capture is permitted by current mock policy
Planner:
show
Project Controls:
show where appropriate
Project Manager:
HIDE Capture Progress
Administrator:
do not automatically show Capture Progress solely because the user is Administrator.
Administrator configuration authority does not equal field execution authority.
The sidebar and top-right page CTAs must follow the same rule.
Do not allow Project Manager mode to display active Capture Progress CTAs.
4 — ROLE SWITCHING CLARITY
When prototype role switching is used, make it obvious that the role is being simulated.
Do not make it appear that Arjun Mehta’s permanently stored role has changed.
Example header treatment:
Arjun Mehta
Administrator · Demo role
or:
Viewing as Administrator
When returning to Planner:
Arjun Mehta
Planner
The role switcher is for prototype testing only.
5 — PROJECT MANAGER PERMISSIONS
Project Manager is primarily read-only.
Visible navigation:
Dashboard
Actuals
Reports
Schedule
Exceptions
Performance
Data Quality
Execution Knowledge
Do not show:
Review Queue
Audit Log
Administration
unless future permissions explicitly change.
Project Manager must NOT perform planner/project-controls actions such as:
Accept Match
Verify Match
Use 26 Aug
Use 27 Aug
Resolve Conflict
Choose final schedule relationship
bulk verification
schedule reconciliation approval
Where a read-only Project Manager opens these workflows:
allow evidence and data viewing
replace action-oriented Dashboard links with read-oriented language.
Examples:
Resolve →
becomes:
View Conflict →
Review →
becomes:
View Review →
Inspect →
may remain Inspect →
View →
may remain View →
Inside restricted details:
disable consequential actions or remove them and show:
Read-only for Project Manager
or:
Planner permission required
Do not merely rely on hiding the Review Queue.
Permission must be enforced at action level as well.
6 — SITE SUPERVISOR PERMISSIONS
Site Supervisor may:
Capture Progress
Log with SENTINEL
Upload Reports
view relevant Actuals
view relevant Reports
view Schedule context
respond to Clarification
Site Supervisor may NOT:
verify schedule relationships
resolve planner-only conflicts
perform schedule reconciliation approval
access Administration
see configuration-only controls
Hide empty navigation section headers after applying these permissions.
7 — DISCIPLINE ENGINEER PERMISSIONS
Discipline Engineer may access:
Dashboard
Actuals
Reports
Schedule
Exceptions
Performance
Data Quality
Execution Knowledge
Scope relevant execution information to assigned discipline where appropriate.
Do not automatically grant planner verification authority.
Hide any resulting empty navigation section heading.
8 — PLANNER PERMISSIONS
Planner may access:
Dashboard
Actuals
Reports
Schedule
Review Queue
Exceptions
Performance
Data Quality
Execution Knowledge
Audit Log where permitted by the existing prototype policy
Planner has full match-review authority.
Planner may:
Accept Match
Choose Another
Mark Unmatched
Request Clarification
resolve approved reconciliation cases
Planner does NOT receive Administration simply because they are a Planner.
9 — PROJECT CONTROLS PERMISSIONS
Project Controls has broad operational access.
Allow:
Review workflows
Schedule reconciliation
Exceptions
Schedule/data integrity
Audit
Performance
Data Quality
Execution Knowledge
Do not confuse Project Controls with Administrator configuration rights.
10 — ADMINISTRATOR PERMISSIONS
Administrator can access:
Administration
Users & Roles
Projects
Disciplines
Matching Rules
Integrations
Settings
configuration-related system surfaces
Administrator rights do NOT automatically grant:
Planner verification authority
field-reporting authority
schedule-truth decision authority
unless the assigned demo permission explicitly includes it.
Keep configuration authority separate from execution-truth authority.
11 — LOGIN CREDENTIAL CONSISTENCY
The Login screen design is approved.
Keep its visual layout.
Correct the demo credential inconsistency.
Default demo account:
Email:
arjun.mehta@sentinel.demo
Password:
sentinel123
Role after sign-in:
Planner
Change helper copy to:
Demo account: arjun.mehta@sentinel.demo
Do NOT prefill:
admin
for the Planner demo login.
If an Administrator demo account is provided later, treat it as a separate account.
Keep:
Remember me
Forgot password
password show/hide
loading state
invalid credentials state
12 — PERFORMANCE PAGE HEADER FIX
Performance → Project currently has a layout issue where upper page content can begin underneath the fixed global header.
Fix permanently.
Ensure the user can fully see:
Performance
Track verified execution against the project plan.
Project | Disciplines
Date Range
Verified-only explanation
without clipping.
Do not otherwise redesign Performance.
13 — PERFORMANCE VARIANCE ACCESSIBILITY
Schedule Variance Trend must not rely solely on red and green.
Keep the current visual chart.
Add hover/focus tooltip text such as:
Aug 1
+2.0% ahead
Aug 15
−1.0% behind
Aug 28
−2.8% behind
Maintain text equivalents for positive/negative states.
14 — DATA QUALITY: CONFLICT TERMINOLOGY
Change:
Conflict Rate — 97%
to:
Conflict-Free Rate — 97%
Supporting text:
Execution records without unresolved conflicting values.
The current metric represents the non-conflicting fraction, not the conflict rate.
15 — DATA QUALITY: MATCH CONFIDENCE
Keep:
Match Confidence — 89%
Change supporting explanation to:
Average confidence across matched schedule candidates.
Do NOT describe it as:
matches rated medium or higher.
Keep confidence distinct from:
Verification
Completeness
Review State
Confidence is not approval.
16 — DATA QUALITY: SOURCE TYPES
Replace unrelated prototype source types such as:
Honeywell PRO
Field Foreman
Work Orders
with SENTINEL’s established sources:
Supervisor Updates
Daily Progress Reports
Spreadsheets
Manual Entries
Site Diaries
Keep the existing Source Coverage by Type visualization.
Do not imply a source is trustworthy merely because of its category.
17 — DATA QUALITY: ACTIVE RECONCILIATION ISSUES
Correct the P-204 conflict record.
Do NOT show:
ERECT LINE 24-XX — P204 Area
as the conflicting record.
Use:
EQUIPMENT ALIGNMENT — P-204
Rotating Equipment · Utility Block
Conflicting Actual Start:
26 Aug 2026
27 Aug 2026
Status:
Conflict
Link to the existing P-204 Exception Detail.
18 — DATA QUALITY: UNMATCHED EXAMPLE
Do NOT show:
HYDROTEST LINE 18-AB
as Unmatched.
That activity already exists elsewhere as a strong schedule candidate.
Use:
Material shifting near Area B
Discipline:
Not reported
Schedule Link:
Not linked
Status:
Unmatched
19 — DATA QUALITY: REVIEW HEALTH COPY
Use:
7 records are pending human review. AI-suggested matches are not treated as verified until an authorized reviewer approves them. Pending review records are excluded from official verified-only performance metrics until verified.
Do NOT claim that pending records disappear from every analytical view.
20 — EXECUTION KNOWLEDGE: REMOVE HIGH RISK
Remove:
High Risk
from:
Execution Knowledge → ERECT LINE.
This is not a safety-risk classification screen.
Use:
Historical Pattern
or no badge.
21 — EXECUTION KNOWLEDGE: FROZEN HERO DATA
Use these exact values everywhere for ERECT LINE:
Verified Samples:
18
Average Planned Duration:
6.2 days
Average Observed Actual Duration:
7.4 days
Observed Variance:
+1.2 days
Completion Within Plan:
39%
Do NOT show:
+1.8d
or contradictory values.
22 — EXECUTION KNOWLEDGE: BOLT TIGHTENING
Use:
Final bolt tightening
Observed in:
9 of 18 verified samples
Supporting wording:
Frequently reported alongside late-stage completion delay.
Do NOT say 12 of 18.
Do not claim proven causality.
23 — EXECUTION KNOWLEDGE: TRUST COPY
Remove statements like:
reviewed and approved by a qualified field engineer
unless that exact reviewer credential exists in the stored prototype evidence.
Use:
This pattern is derived from 18 human-verified Actual Events and their verified schedule relationships. It reflects observed execution history only and is not an automatic forecast or schedule recommendation.
24 — EXECUTION KNOWLEDGE: OBSERVED SEQUENCE
Replace overly specific invented workflow steps with:
Material readiness
↓
Spool positioning
↓
Erection
↓
Alignment
↓
Bolt tightening
↓
Completion
Heading:
Common observed sequence
Supporting text:
Observed across verified historical records. Individual activities may follow different execution sequences.
Do not present this as an engineering procedure.
25 — EXECUTION KNOWLEDGE TYPOGRAPHY
Use normal SENTINEL typography for:
ERECT LINE
main pattern names
field phrases
execution terminology
Do not use terminal/code typography.
Approved stack:
-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, sans-serif
Monospace may remain for true technical IDs such as:
EKP-EREC
but nowhere else unnecessarily.
26 — EXECUTION KNOWLEDGE DURATION COMPARISON
Ensure the ERECT LINE Pattern Detail visibly contains:
Planned vs Observed Duration
Planned:
6.2 days
Observed:
7.4 days
Difference:
+1.2 days
Label:
Historical observation
Do not imply future prediction certainty.
27 — ACTUALS FINAL CLEANUP
Ensure the Actuals table never clips:
TRUST / STATUS
especially long values such as:
Awaiting Clarification
On standard desktop widths, rebalance columns cleanly.
Use horizontal scrolling only if required.
Do not excessively shrink typography.
Material shifting must show:
Discipline:
Not reported
not:
Civil
Actual IDs should remain secondary but readable.
28 — EXCEPTION DETAIL FINAL COPY
Use this exact high-level information architecture:
WHAT HAPPENED
WHY THIS IS A PROBLEM
WHAT CAN I DO?
Do not use:
RESOLUTION
as the third main section title.
Where a schedule relationship exists, provide:
View Actual
View Source Evidence
View Schedule Activity
29 — EXCEPTION VISUAL POLISH
Keep conflict evidence side-by-side on desktop.
Reduce excessive red border emphasis if it feels visually heavy.
Red should focus primarily on:
conflicting values
blocked schedule update
critical conflict status
Do not make the entire screen feel like a critical alarm dashboard.
30 — SCHEDULE FINAL REGRESSION CHECK
Do NOT redesign Schedule.
Verify that previously fixed behaviors remain working:
Activities page scrolls vertically through all disciplines.
Timeline scrolls vertically through all disciplines.
left activity hierarchy and right timeline stay aligned.
Today marker shows one clean:
Today · 28 Aug
label.
No duplicated 28 Aug label.
P-204 conflict uses two markers without overlapping date labels.
Hover tooltip belongs to the exact hovered activity.
ERECT LINE 24-XX Actual Start:
26 Aug 2026
Actual Finish:
Not reported
In-progress visuals must never imply a verified Actual Finish.
Keep all of these fixes.
31 — NOTIFICATION DATA CONSISTENCY
Keep the Notifications design.
Change the pending notification:
Match awaiting review
Spool erection requires planner validation.
because ACT-2026-0842 / ERECT LINE 24-XX has already been verified.
Use:
Match awaiting review
FOUNDATION BLOCK C-14 requires planner validation.
Keep other examples:
Conflict detected
EQUIPMENT ALIGNMENT — P-204 has conflicting Actual Start dates.
Report processed
Piping_DPR_28Aug.pdf produced 6 Actual Events.
Clarification received
Additional context was provided for a Welding Actual.
Match verified
ERECT LINE 24-XX Actual Start updated.
32 — NOTIFICATION INTERACTIONS
Ensure notification clicks navigate correctly:
Foundation review
→ Review Queue / relevant record
P-204 conflict
→ Exception Detail
Piping report
→ Report Analysis
Welding clarification
→ relevant Actual / Exception
ERECT LINE verification
→ Actual Detail or Schedule Activity Detail
Mark all as read:
clear unread state
update bell badge
Badge count and visible unread rows must remain consistent.
33 — ADMINISTRATION USERS & ROLES
Keep the existing Administration design.
Fix Project Manager row.
Do NOT put:
Read-heavy
inside the Discipline column.
Use:
All
or:
—
Permission behavior should communicate read-heavy access elsewhere, not as a discipline.
If layout allows without clutter, include:
Project filter
Status filter
alongside:
Search Users
Role
Do not overcrowd the toolbar.
34 — ADMINISTRATION ROLE MATRIX
Ensure the permission matrix clearly distinguishes:
Capture
Execution
Schedule
Review
Insights
Administration
Do not create a giant unreadable spreadsheet.
Administrator configuration rights do not automatically imply planner authority.
35 — INTEGRATIONS STATUS
Keep the Integrations screen.
Change:
SENTINEL Schedule Mirror — Connected
to:
SENTINEL Schedule Mirror — Active Prototype
or:
Connected · Prototype
Preferred:
Active Prototype
Keep:
Primavera P6 — Not Connected / Future Integration
Microsoft Project — Not Connected / Future Integration
Enterprise PMIS — Not Connected / Future Integration
Never imply live external connectivity.
36 — AUDIT SUMMARY VALUES
Use the frozen demo values:
Events Today:
24
Human Decisions:
8
Schedule Updates:
6
System Actions:
10
Do not use contradictory smaller values.
37 — AUDIT TABLE COLUMNS
Audit table must expose:
TIME
ACTION
ENTITY
ACTOR
SOURCE
CHANGE
RESULT
Example:
Actual Start updated
Entity:
ERECT LINE 24-XX
Change:
— → 26 Aug 2026
Result:
Applied
Schedule candidate suggested
Entity:
ACT-2026-0842
Change:
ERECT LINE 24-XX · 91%
Result:
AI Suggested
If screen width is insufficient:
use clean horizontal scrolling.
Do not silently remove CHANGE or RESULT.
38 — AUDIT FILTERS
Provide:
Search
Actor
Action Type
Entity Type
Date
Source
Clear Filters
Keep controls compact.
39 — AUDIT DETAIL
Audit detail remains read-only.
Show:
Action
Actor
Timestamp
Entity
Source
Old Value
New Value
Decision Context
Related Evidence
Related Actual
Related Schedule Activity
Do NOT provide:
Edit
Delete
For AI records expose:
candidate
confidence
matching signals
Do not expose hidden chain-of-thought.
40 — GLOBAL SEARCH
The current Global Search design is approved.
Preserve it.
Search:
ERECT
should return at minimum:
ERECT LINE 24-XX
Schedule Activity
Piping · Area B
and:
ACT-2026-0842
Actual Event
Spool erection · Piping · Verified
Clicking results must navigate correctly.
Keyboard behavior:
Up
Down
Enter
Esc
No-results state:
No results found
Try another activity ID, report name or field term.
41 — PROFILE
Keep identity only in the top-right header.
Do not restore duplicate sidebar identity.
Profile menu:
Arjun Mehta
Planner
Infrastructure Expansion
My Profile
Preferences
Sign Out
In demo-role switching mode, clearly show the simulated role.
42 — SENTINEL GUIDE
Keep SENTINEL Guide contextual.
It may:
explain current page
explain confidence
explain verification
explain exceptions
find records
link users to screens
It must NOT:
Accept Match
Verify Actual
Resolve Conflict
change schedule truth
modify evidence
change system settings automatically
Do NOT convert it into a generic chatbot.
No floating ChatGPT bubble.
43 — PAGE HEADER OFFSET QA
Perform a global check for fixed-header overlap.
No page title, breadcrumb, tab, metric summary or explanatory text should begin underneath the global top bar.
Check at minimum:
Dashboard
Actuals
Reports
Schedule
Review Queue
Exceptions
Performance
Data Quality
Execution Knowledge
Audit Log
Administration
Fix any shared layout/root cause globally rather than screen-by-screen where possible.
44 — SCROLLING QA
Test every long page.
Users must be able to reach the bottom using:
mouse wheel
trackpad
scrollbar
keyboard where applicable
Do not use:
overflow: hidden
on page parents if it traps page content.
Important pages:
Schedule Activities
Schedule Timeline
Report Analysis
Actual Detail
Exception Detail
Performance
Data Quality
Execution Knowledge
Audit
Administration
No lower content may be inaccessible.
45 — TABLE QA
Ensure tables do not unintentionally clip important columns.
Priority pages:
Actuals
Reports
Review Queue
Schedule Activities
Exceptions
Performance tables
Audit
Administration
If necessary:
allow restrained horizontal scrolling
freeze important first columns where useful
maintain headers
maintain row alignment
Do not solve by using unreadably small fonts.
46 — LIGHT / DARK CONSISTENCY
Run final visual consistency across both themes.
Light mode:
#FAFAFC-oriented page background
clean white/glass surfaces
dark readable text
Dark mode:
charcoal
not pure black
subtle borders
restrained orange
Charts, tooltips, dialogs, dropdowns and evidence highlighting must remain readable.
Do not allow components to disappear or lose contrast when theme changes.
47 — TYPOGRAPHY CONSISTENCY
Normal UI must use the existing SENTINEL system stack.
Avoid accidental monospace typography for:
activity names
metrics
pattern names
field phrases
schedule rows
normal labels
Use monospace only for true identifiers where useful.
Maintain the improved KPI numeral styling.
48 — EMPTY STATES
Ensure polished reusable empty states exist.
Global Search:
No results found
Notifications:
You're all caught up.
Audit:
No audit events match these filters.
Review Queue:
No items require review.
Exceptions:
No open exceptions match these filters.
Actuals:
No Actual Events match these filters.
Reports:
No reports match these filters.
Avoid giant illustrations.
49 — LOADING STATES
Use subtle skeletons for:
tables
cards
drawers
analysis panels
Avoid giant spinners.
Do not show fake percentages unless the value is actually known.
50 — ERROR STATES
Use concise product-level errors.
Example:
Unable to load audit history.
Try Again
Example:
Unable to process this file.
Choose Another File
Do not display:
stack traces
technical exception codes
raw backend messages
51 — PERMISSION STATES
Restricted states must be consistent.
Possible copy:
Access Restricted
You do not have permission to perform this action.
or contextual:
Planner permission required
or:
Read-only for Project Manager
Use disabled controls only where seeing the unavailable action helps explain the workflow.
Otherwise hide actions that have no value to the role.
Do not leave blank layout gaps after hiding actions.
52 — RESPONSIVE FINAL PASS
Desktop:
retain current professional density.
Tablet:
collapse lower-priority columns.
Drawers adapt cleanly.
Sidebar responsive behavior remains stable.
Mobile:
do not squeeze desktop tables/Gantt layouts.
Use:
cards
stacked evidence
full-screen drawers
mobile-friendly command search
full-width notifications if needed
accessible sticky action bars
Login must work cleanly on mobile.
53 — FINAL DEMO DATA CONSISTENCY
Use these values everywhere.
Project:
Infrastructure Expansion
Demo date:
28 Aug 2026
Overall Execution:
68.4%
Plan:
71.2%
Variance:
−2.8%
Started Late:
23
Finished Late:
11
Needs Review:
7
Exceptions:
3
ERECT LINE 24-XX
Piping
Area B
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
Relationship:
Verified
Historical AI Confidence:
91%
ACT-2026-0842
Spool erection
Actual Start
26 Aug 2026
Piping
Area B
Linked:
ERECT LINE 24-XX
Verified by:
Arjun Mehta
EQUIPMENT ALIGNMENT — P-204
Rotating Equipment
Utility Block
Conflicting Actual Start evidence:
26 Aug 2026
27 Aug 2026
Do not automatically resolve.
FOUNDATION BLOCK C-14
Civil
Needs Review
CABLE TRAY INSTALLATION — UTILITY BLOCK
Electrical
Actual Start:
Not reported
Material shifting near Area B
Discipline:
Not reported
Schedule Link:
Not linked
Status:
Unmatched
Piping_DPR_28Aug.pdf
6 Actual Events
4 Strong Matches
1 Needs Review
1 Incomplete
Execution Knowledge — ERECT LINE
18 verified samples
6.2 days planned
7.4 days observed
+1.2 days observed variance
39% within plan
Final bolt tightening:
9 / 18 verified samples
54 — FINAL TRUST RULES
Never violate these rules during polish:
Original evidence is preserved.
Missing information is never fabricated.
Missing does not mean zero.
AI Suggested is not Verified.
Confidence is not approval.
Only authorized human decisions establish trusted schedule relationships.
Conflicts preserve every source.
Duplicates preserve evidence.
Incomplete Actuals remain stored.
Unmatched Actuals remain stored.
Planner-added context remains distinguishable from field evidence.
Human overrides preserve AI history.
Actual Start and Actual Finish remain primary schedule truth.
Do not infer Actual Finish from “final bolt tightening pending.”
Verified Actuals only drive official project performance.
Execution Knowledge is historical observation, not automatic prediction.
SENTINEL does not automatically change future schedule durations.
SENTINEL Guide does not make operational decisions.
Administrator does not automatically equal Planner.
Project Manager remains primarily read-only.
SENTINEL is not a replacement for Primavera P6 or Microsoft Project.
Prototype integrations must not imply production connectivity.
55 — FINAL SIH DEMO FLOW
Make sure this exact demonstration can be performed without dead ends.
STEP 1
Login as:
arjun.mehta@sentinel.demo
Password:
sentinel123
Role:
Planner
→ Dashboard
STEP 2
Show:
68.4% Execution
71.2% Plan
−2.8% Variance
Needs Review 7
Exceptions 3
STEP 3
Capture Progress
→ Log with SENTINEL
Input:
Pump P-204 alignment started this morning.
SENTINEL identifies:
Actual Start
P-204
asks Area
select:
Utility Block
shows structured Actual
suggests:
EQUIPMENT ALIGNMENT — P-204
93%
submit
→ Awaiting Review
STEP 4
Upload Report:
Piping_DPR_28Aug.pdf
→ 6 Actual Events
→ Source ↔ Actual highlighting
STEP 5
Review:
Spool erected in Area B. Final bolt tightening pending.
→ ERECT LINE 24-XX
→ 91%
→ Accept Match
→ Verified
STEP 6
Schedule:
ERECT LINE 24-XX
Planned Start:
24 Aug
Actual Start:
26 Aug
+2 days
Actual Finish:
Not reported
STEP 7
Exceptions:
EQUIPMENT ALIGNMENT — P-204
show:
26 Aug
27 Aug
Schedule Update:
Blocked
preserve both sources
STEP 8
Performance:
68.4% vs 71.2%
verified Actuals only
STEP 9
Data Quality:
94% Source Coverage
89% Match Confidence
4.2% Missing Data
2.8% Unmatched
7 Review Backlog
STEP 10
Execution Knowledge:
ERECT LINE
18 verified samples
6.2d planned
7.4d observed
+1.2d
Final bolt tightening 9/18
Historical Pattern
STEP 11
Audit:
Source
→ Actual
→ AI Suggestion
→ Human Decision
→ Schedule Update
This final demo route must work without broken navigation or contradictory data.
56 — DO NOT ADD NEW FEATURES
Do NOT add:
new dashboards
new AI modules
new pages
chatbot
real backend
database
real authentication
real notifications
real email delivery
real OCR
live Primavera P6 connection
live Microsoft Project connection
production integrations
This is a final refinement pass only.
57 — FINAL SUCCESS CRITERIA
The finished SENTINEL prototype should make a judge understand within minutes:
what the field reported
→ what SENTINEL extracted
→ what SENTINEL thinks it matches
→ why
→ what remains uncertain
→ what a human approved
→ what became trusted schedule truth
→ how project controls can monitor it
→ how historical verified execution creates reusable knowledge
No screen should contradict that story.
Stop after this final QA and polish pass is complete.