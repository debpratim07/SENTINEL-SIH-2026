Use the same approach as before:
Long specification below → let Figma Make turn it into .md if needed.
Then paste the short execution message at the end into the normal Make prompt box.
SENTINEL — BATCH 7
Final major build: System, Access, Audit, Search, Notifications, Guide + carry-forward fixes
Keep the existing SENTINEL application exactly as currently designed.
Batches 1–6 are approved structurally.
Preserve the existing:
- SENTINEL logo and branding
- application shell
- 248px expanded / 72px collapsed sidebar
- light and dark themes
- typography
- Dashboard
- Capture Progress
- Log with SENTINEL
- Review Queue / Review Match
- Schedule
- Reports / Report Analysis
- Actuals / Actual Detail
- Exceptions / Resolution workflows
- Performance
- Data Quality
- Execution Knowledge
- reusable components
- centralized mock data
- trust model
- existing responsive patterns
Do NOT redesign approved screens.
First apply all carry-forward corrections below.
Then build ONLY Batch 7.
PART A — PERFORMANCE FIXES
A1 — PERFORMANCE HEADER OVERLAP
The Performance Project page currently begins underneath the fixed global header, causing the page title, supporting text, tabs or verified-only message to be partially clipped.
Fix layout hierarchy.
The content region must begin completely below the fixed application header.
Performance page must clearly show:
Performance
Track verified execution against the project plan.
Project | Disciplines
Date Range:
Aug 2026
The verified-data explanation must also remain fully visible.
Do not change the existing Performance visual design.
A2 — VARIANCE CHART ACCESSIBILITY
Schedule Variance Trend must not communicate meaning using red and green alone.
Each bar must expose text on hover/focus such as:
Aug 1
+2.0% ahead
Aug 15
−1.0% behind
Aug 28
−2.8% behind
Maintain existing chart colors but ensure status is also communicated through text/tooltips.
PART B — DATA QUALITY CORRECTIONS
B1 — CONFLICT RATE TERMINOLOGY
The Data Quality page currently shows:
Conflict Rate — 97%
with logic based on 100% minus conflicting records.
This terminology is incorrect.
Change it to:
Conflict-Free Rate
97%
Supporting text:
Execution records without unresolved conflicting values.
Do not call 97% a Conflict Rate.
B2 — MATCH CONFIDENCE DEFINITION
Change the supporting explanation under:
Match Confidence — 89%
to:
Average confidence across matched schedule candidates.
Do NOT describe it as:
matches rated medium or higher.
Keep Match Confidence visually distinct from:
Verification Rate
Review Status
Completeness
Confidence is not approval.
B3 — SOURCE COVERAGE TYPES
Replace unrelated source categories such as:
Honeywell PRO
Field Foreman
Work Orders
with SENTINEL's established sources:
Supervisor Updates
Daily Progress Reports
Spreadsheets
Manual Entries
Site Diaries
Keep the existing chart/layout.
Use realistic prototype percentages but do not imply that source type alone determines trustworthiness.
B4 — ACTIVE RECONCILIATION ISSUES
Correct the conflicting hero record.
Do NOT show:
ERECT LINE 24-XX — P204 Area
as the P-204 conflict.
Use:
EQUIPMENT ALIGNMENT — P-204
Rotating Equipment · Utility Block
Problem:
Conflicting Actual Start
Values:
26 Aug 2026
27 Aug 2026
Status:
Conflict
Link to the existing Exception Detail.
B5 — UNMATCHED EXAMPLE
Do NOT classify:
HYDROTEST LINE 18-AB
as Unmatched because it already exists in the Report Analysis demo as a strong schedule candidate.
Use instead:
Material shifting near Area B
Type:
Unmatched
Relationship:
No safe schedule link
B6 — REVIEW HEALTH WORDING
Use:
7 records are pending human review. AI-suggested matches are not treated as verified until an authorized reviewer approves them. Pending review records are excluded from official verified-only performance metrics until verified.
Do not imply they disappear from every analytical view in SENTINEL.
PART C — EXECUTION KNOWLEDGE CORRECTIONS
C1 — REMOVE HIGH RISK
Remove the:
High Risk
badge from:
Execution Knowledge → ERECT LINE.
Execution Knowledge is historical execution intelligence, not safety risk classification.
Replace with:
Historical Pattern
or omit the badge entirely.
C2 — RESTORE FROZEN ERECT LINE DATA
Use these exact hero values consistently:
ERECT LINE
Discipline:
Piping
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
Do NOT use +1.8d.
C3 — BOLT TIGHTENING FREQUENCY
Use:
Final bolt tightening
Observed in:
9 of 18 verified samples
Do NOT show 12 of 18.
Describe it as:
Frequently reported alongside late-stage completion delay.
Do not claim proven causality.
C4 — HISTORICAL TRUST WORDING
Remove claims such as:
reviewed and approved by a qualified field engineer
unless directly represented by the recorded review metadata.
Use:
This pattern is derived from 18 human-verified Actual Events and their verified schedule relationships. It reflects observed execution history only and is not an automatic forecast or schedule recommendation.
C5 — COMMON EXECUTION SEQUENCE
Replace overly specific invented process steps with the simpler historical sequence:
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
Label:
Common observed sequence
Supporting note:
Observed across verified historical records. Individual activities may follow different execution sequences.
Do not present this as a mandatory engineering work method.
C6 — EXECUTION KNOWLEDGE TYPOGRAPHY
Do not use terminal/code-like typography for:
ERECT LINE
main pattern titles
field-language phrases
normal execution terminology
Use the approved SENTINEL system font:
-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, sans-serif
A subtle mono treatment is acceptable only for technical IDs such as:
EKP-EREC
C7 — PLANNED VS OBSERVED DURATION
Ensure Pattern Detail visibly contains:
Planned vs Observed Duration
Planned:
6.2 days
Observed Actual:
7.4 days
Difference:
+1.2 days
Use a simple restrained comparison/chart.
Clearly label:
Historical observation
Do not imply prediction certainty.
PART D — BUILD BATCH 7
Now build ONLY:
1. Login
2. Audit Log
3. Administration
4. Users & Roles
5. Projects
6. Disciplines
7. Matching Rules
8. Integrations
9. Settings
10. Global Search
11. Notifications
12. Profile
13. SENTINEL Guide
14. Role-based permission behavior
15. Permission denied / restricted states
16. supporting system states needed for these surfaces
Do NOT redesign operational Batch 1–6 pages.
PART E — LOGIN
Create a premium, restrained SENTINEL login screen.
Do not use the application sidebar/header on Login.
Use the exact supplied SENTINEL logo.
Layout:
centered authentication panel with generous whitespace.
Heading:
Sign in to SENTINEL
Supporting text:
Access trusted project execution and schedule intelligence.
Fields:
Email
Password
Options:
Remember me
Forgot password?
Primary CTA:
Sign In
Use the SENTINEL gradient subtly.
Do not use social login buttons unless required.
LOGIN DEMO
Allow prototype login using:
arjun.mehta@sentinel.demo
Role:
Planner
Password may use a generic masked demo value.
This is mock interaction only.
Do not build real authentication.
After successful demo login:
route to Dashboard.
LOGIN STATES
Support:
Default
Password visible/hidden
Invalid credentials
Loading
Forgot Password
Forgot Password screen:
Reset your password
Email
Send Reset Link
Back to Sign In
This remains prototype UI.
Do not claim real email delivery.
PART F — AUDIT LOG
Make:
Audit Log
sidebar navigation functional.
Header:
Audit Log
Supporting text:
Trace how field evidence became trusted schedule information.
Audit should reinforce SENTINEL's lineage model:
SOURCE
↓
ACTUAL EVENT
↓
AI SUGGESTION
↓
HUMAN DECISION
↓
SCHEDULE UPDATE
AUDIT SUMMARY
Use compact metrics:
Events Today
24
Human Decisions
8
Schedule Updates
6
System Actions
10
Do not use giant KPI cards.
AUDIT TOOLBAR
Search audit events...
Actor ▾
Action Type ▾
Entity Type ▾
Date ▾
Source ▾
Clear Filters
AUDIT TABLE
Columns:
TIME
ACTION
ENTITY
ACTOR
SOURCE
CHANGE
RESULT
Use records consistent with existing SENTINEL demo data.
Example:
28 Aug 2026 · 10:44
Match verified
ACT-2026-0842
Arjun Mehta
Supervisor Update
ERECT LINE 24-XX
Verified
Next:
28 Aug · 10:44
Actual Start updated
ERECT LINE 24-XX
SENTINEL Schedule Mirror
26 Aug 2026
Applied
Next:
28 Aug · 08:43
Schedule candidate suggested
ACT-2026-0842
SENTINEL
ERECT LINE 24-XX
91%
AI Suggested
Next:
28 Aug · 08:42
Actual captured
ACT-2026-0842
Supervisor Update
Spool erection
Recorded
AUDIT DETAIL
Click an audit record to open a right-side detail drawer.
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
Important:
Do not expose hidden chain-of-thought.
For AI actions, show:
candidate
confidence
matching signals
not internal reasoning.
AUDIT IMMUTABILITY
Audit records should visually behave as read-only.
No Edit.
No Delete.
No silent history rewriting.
Human overrides must preserve the original AI suggestion.
PART G — ADMINISTRATION
Make:
Administration
functional.
Use internal tabs or secondary navigation:
Users & Roles
Projects
Disciplines
Matching Rules
Integrations
Settings
Do not create six new sidebar top-level entries.
ADMINISTRATION — USERS & ROLES
Header:
Users & Roles
Supporting text:
Manage access to SENTINEL project workspaces.
Toolbar:
Search users...
Role ▾
Project ▾
Status ▾
Action:
Add User
USER TABLE
Columns:
USER
ROLE
PROJECT
DISCIPLINE
STATUS
LAST ACTIVE
ACTIONS
Use sample users:
Arjun Mehta
Planner
Infrastructure Expansion
All disciplines
Active
Priya Nair
Discipline Engineer
Infrastructure Expansion
Electrical
Active
Rohan Das
Site Supervisor
Infrastructure Expansion
Piping
Active
Anita Verma
Project Controls
Infrastructure Expansion
All disciplines
Active
Project Manager demo user
Project Manager
Infrastructure Expansion
Read-heavy access
Active
Administrator demo user
Administrator
System
Active
ADD / EDIT USER
Use modal:
Add User
Name
Email
Role
Project
Discipline
Status
Cancel
Add User
Prototype only.
No real invitation emails.
ROLE PERMISSIONS
Use the frozen roles:
Site Supervisor
Discipline Engineer
Planner / Scheduler
Project Controls
Project Manager
Administrator
Show a readable permission matrix.
Avoid a giant unreadable spreadsheet.
Group permissions by:
Capture
Execution
Schedule
Review
Insights
Administration
Example rules:
Site Supervisor:
capture execution, upload reports, respond to clarification
Planner:
full schedule-match review
Project Controls:
review + schedule/data integrity
Project Manager:
primarily read-only
Administrator:
configuration authority
Important:
Administrator does not automatically equal execution-truth reviewer.
PART H — PROJECTS
Administration → Projects
Show:
Infrastructure Expansion
Status:
Active
Schedule Level:
L5/L6
Project Type:
Infrastructure
Schedule Mirror:
Active
Last Schedule Import:
28 Aug 2026
Disciplines:
7
Actions:
View
Configure
Do not create live P6 integration claims.
PROJECT CONFIGURATION
Show:
Project Name
Project Code
Default Time Zone
Schedule Level
Review Policy
Enabled Disciplines
Schedule Source
For prototype:
Schedule Source:
SENTINEL Schedule Mirror
Allow future options visually:
Primavera P6
Microsoft Project
Enterprise PMIS
but label them:
Future Integration / Not Connected
PART I — DISCIPLINES
Use the established disciplines:
Civil
Piping
Static Equipment
Rotating Equipment
Electrical
Instrumentation
HSE
Table:
DISCIPLINE
CODE
ACTIVE USERS
ACTUAL EVENTS
STATUS
Allow:
Add Discipline
Edit
Disable
Prototype only.
Do not delete historical discipline data.
PART J — MATCHING RULES
Administration → Matching Rules
Purpose:
Configure how SENTINEL evaluates schedule candidates and routes uncertain matches to review.
Do NOT expose low-level ML configuration.
Use understandable operational controls.
Sections:
Matching Signals
Review Policy
Bulk Verification Eligibility
Missing Context Handling
Conflict Handling
MATCHING SIGNALS
Show configurable importance of:
Activity terminology
Equipment / Line reference
Discipline
Area
Hierarchy compatibility
Schedule date context
Use labels like:
High
Medium
Low
rather than arbitrary fake algorithm weights if not required.
REVIEW POLICY
Show rules conceptually:
Strong complete matches
→ eligible for planner review / policy-based bulk review
Ambiguous matches
→ individual review
Incomplete records
→ clarification / manual context
Conflicts
→ schedule update blocked
Unmatched
→ remain stored without forced schedule link
Do not build unsafe auto-verification.
PART K — INTEGRATIONS
Administration → Integrations
Show cards/rows:
SENTINEL Schedule Mirror
Status:
Connected / Active Prototype
Description:
Internal prototype representation of project schedule and verified actual updates.
Primavera P6
Status:
Not Connected
Future Integration
Microsoft Project
Status:
Not Connected
Future Integration
Enterprise PMIS
Status:
Not Connected
Future Integration
Do NOT claim live connectivity.
Actions such as:
Configure
can be visual-only.
PART L — SETTINGS
Administration → Settings
Sections:
Project Preferences
Review Preferences
Display
Notifications
Security
Data Retention
Do not build real infrastructure settings.
Include useful prototype controls:
Default Date Format
Default Theme
Review reminder preference
Notification categories
Show evidence timestamps
Compact table density
Require confirmation for verification
All should use reusable settings controls.
PART M — GLOBAL SEARCH
Make the existing global header search functional.
Clicking or using:
/
opens a centered command-palette style search surface.
Do NOT create a standalone Search page.
Heading:
Search SENTINEL
Input:
Search activities, actuals, reports, exceptions or pages...
Group results:
Schedule Activities
Actual Events
Reports
Exceptions
Pages
SEARCH DEMO
Typing:
ERECT LINE
should show:
ERECT LINE 24-XX
Schedule Activity
Piping · Area B
ACT-2026-0842
Actual Event
Spool erection
Piping_DPR_28Aug.pdf
Report
Clicking a result routes to the correct existing page/detail.
Keyboard support:
↑ ↓
Enter
Esc
Use subtle keyboard hints.
PART N — NOTIFICATIONS
Make the header notification bell functional.
Do NOT create a standalone notification-center page.
Click bell:
open a compact right-aligned popover.
Header:
Notifications
Action:
Mark all as read
Use realistic SENTINEL notifications:
Match awaiting review
Spool erection requires planner validation.
2 min ago
Conflict detected
EQUIPMENT ALIGNMENT — P-204 has conflicting Actual Start dates.
18 min ago
Report processed
Piping_DPR_28Aug.pdf produced 6 Actual Events.
42 min ago
Clarification received
Additional context was provided for a Welding Actual.
1 hr ago
Match verified
ERECT LINE 24-XX Actual Start updated.
2 hr ago
Click notifications to navigate to corresponding screens.
Bell badge should reflect unread count.
NOTIFICATION RULES
Do not notify every trivial system action.
Focus on:
review required
conflict
clarification
report completion
verification
schedule-impacting events
Support read/unread visual state.
PART O — PROFILE
Make the top-right Arjun Mehta profile control functional.
Open compact profile menu:
Arjun Mehta
Planner
Infrastructure Expansion
Options:
My Profile
Preferences
Sign Out
Do not duplicate user identity in the sidebar.
PROFILE PAGE / DRAWER
Use a compact page or large drawer.
Show:
Name
Arjun Mehta
Role
Planner
Project
Infrastructure Expansion
Email
arjun.mehta@sentinel.demo
Assigned Disciplines
All
Theme Preference
System / Light / Dark
Notification Preferences
Do not allow Planner to edit their own role.
PART P — SENTINEL GUIDE
Implement:
SENTINEL Guide
as contextual product assistance.
This is NOT a generic ChatGPT chatbot.
Do NOT create:
floating chatbot bubble
AI Assistant page
open-ended general conversation UI
GUIDE ENTRY
Allow opening from:
help icon
command palette
contextual Guide action
Prefer a compact right-side drawer or command-style surface.
Header:
SENTINEL Guide
Supporting text:
Get help understanding the current workflow or finding project information.
CONTEXTUAL EXAMPLES
On Review Queue:
What does confidence mean?
Guide response:
Confidence indicates how strongly the available execution evidence aligns with a schedule candidate. It does not mean the relationship has been verified.
Action:
Learn about Review Decisions
On Exceptions:
Why is this schedule update blocked?
Guide response:
This Actual Event contains conflicting field evidence. SENTINEL preserves both values and blocks the schedule update until an authorized reviewer resolves the conflict.
Action:
Open Exception
On Data Quality:
What does Match Confidence mean?
Explain the correct metric without treating it as verification.
GUIDE RESTRICTIONS
SENTINEL Guide may:
explain current UI
explain statuses
find records
link to pages
help navigate workflows
It may NOT:
Accept Match
Verify Actual
Resolve Conflict
Modify Schedule Truth
Delete Evidence
Change Administration settings silently
No autonomous operational decisions.
PART Q — ROLE-BASED UI
Implement mock role switching for prototype testing.
This may live under profile or Administration demo controls.
Roles:
Site Supervisor
Discipline Engineer
Planner
Project Controls
Project Manager
Administrator
Switching roles should change available navigation/actions using centralized mock state.
ROLE BEHAVIOR
Site Supervisor
Visible:
Dashboard
Actuals
Reports
Schedule
Capture Progress
Can:
Log with SENTINEL
Upload Report
respond to clarification
Cannot:
verify schedule matches
resolve planner-only schedule relationships
administer system
Discipline Engineer
Visible:
Dashboard
Actuals
Reports
Schedule
Exceptions
Performance
Data Quality
Execution Knowledge
Mostly discipline-scoped.
Planner
Visible:
Dashboard
Actuals
Reports
Schedule
Review Queue
Exceptions
Performance
Data Quality
Execution Knowledge
Audit Log where permitted
Full review decision actions.
Project Controls
Broad operational access including:
Review
Schedule integrity
Audit
Reconciliation
Project Manager
Mostly read-only:
Dashboard
Actuals
Reports
Schedule
Exceptions
Performance
Data Quality
Execution Knowledge
Do not show verification/resolution CTAs as executable actions.
Administrator
All configuration screens.
Administration access.
Do not assume Administrator automatically has planner verification authority unless assigned.
PART R — RESTRICTED ACTION STATES
When a user lacks permission:
Do not simply hide every action.
For important contextual actions, show disabled state where useful with tooltip:
Planner permission required
or:
Read-only for Project Manager
For direct protected routes show:
Access Restricted
You do not have permission to perform this action.
Supporting:
Contact your SENTINEL administrator if your role requires additional access.
Action:
Return to Dashboard
Do not make restricted states alarming.
PART S — SYSTEM STATES
Support reusable states for Batch 7 screens:
Loading
Empty
Error
No Permission
No Search Results
No Notifications
No Audit Records for Filter
No Users Found
No Integration Connected
Use restrained UI.
EMPTY EXAMPLES
Global Search:
No results found
Try another activity ID, report name or field term.
Notifications:
You're all caught up.
No unread project notifications.
Audit:
No audit events match these filters.
Clear Filters
LOADING
Use skeleton states consistent with existing cards/tables.
Avoid giant spinners.
Do not use fake percentages.
ERROR
Example:
Unable to load audit history.
Try Again
Do not expose technical stack traces.
PART T — GLOBAL CONSISTENCY
Ensure navigation links work for all built pages.
No dead sidebar entries after Batch 7.
The following should now be functional:
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
Capture Progress
Global Search
Notifications
Profile
SENTINEL Guide
PART U — FINAL DATA CONSISTENCY
Maintain these established values everywhere:
Project:
Infrastructure Expansion
Date:
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
ERECT LINE 24-XX:
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
Verified relationship
Historical AI confidence:
91%
EQUIPMENT ALIGNMENT — P-204:
Rotating Equipment
Utility Block
Conflicting Actual Starts:
26 Aug 2026
27 Aug 2026
No automatic resolution
FOUNDATION BLOCK C-14:
Civil
Needs Review
CABLE TRAY INSTALLATION — UTILITY BLOCK:
Electrical
Actual Start:
Not reported
Material shifting near Area B:
Discipline:
Not reported
Schedule Link:
Not linked
Status:
Unmatched
ERECT LINE Execution Knowledge:
18 verified samples
6.2d planned
7.4d observed
+1.2d variance
39% within plan
Final bolt tightening:
9 / 18 samples
PART V — TRUST RULES
These remain non-negotiable:
1. Evidence is preserved.
2. Missing data is never fabricated.
3. Missing is not zero.
4. AI Suggested is not Verified.
5. Confidence is not approval.
6. Only authorized human verification creates trusted schedule relationships.
7. Conflict preserves both sources.
8. Unsafe schedule updates remain blocked.
9. Human overrides preserve AI history.
10. Audit history is immutable in the prototype.
11. Execution Knowledge is historical observation, not automatic prediction.
12. SENTINEL Guide cannot change execution truth.
13. Project Manager is primarily read-only.
14. Administrator configuration rights do not automatically imply planner authority.
15. SENTINEL is not a replacement for Primavera P6 or Microsoft Project.
16. Prototype integrations must never be presented as live integrations.
PART W — VISUAL DIRECTION
Preserve:
premium
calm
precise
high-trust
industrial-professional
moderately dense
Apple clarity + professional project-controls density.
Avoid:
generic admin-template design
cyberpunk
neon
excessive glass
excessive gradients
excessive orange
giant icons
huge KPI cards
generic AI sparkle effects
floating chatbot UI
old ERP styling
PART X — RESPONSIVE
Ensure Batch 7 surfaces behave correctly:
Desktop:
full app shell and tables
Tablet:
compressed tables and responsive drawers
Mobile:
sidebar becomes appropriate mobile navigation
Login:
fully mobile friendly
Global Search:
full-width command overlay if necessary
Notifications:
full-width panel on mobile
Administration tables:
cards/stacked rows where required
Audit:
compact cards on mobile
Do not squeeze desktop tables unreadably.
PART Y — ACCESSIBILITY
Maintain:
keyboard navigation
visible focus states
semantic form labels
accessible tables
tooltips for icon-only controls
status meaning beyond color
modal focus trapping
Esc to dismiss overlays
accessible command search
accessible notification list
appropriate light/dark contrast
FINAL BATCH 7 RULE
Build ONLY the Batch 7 system/supporting functionality described above and apply the carry-forward corrections at the beginning.
Do NOT redesign Batches 1–6.
Do NOT add:
real backend
real authentication
database integration
live P6/MS Project integration
real notification delivery
real email service
generic chatbot
Do not create a Batch 8 feature set.
Stop when Batch 7 is complete