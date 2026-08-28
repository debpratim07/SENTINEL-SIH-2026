Keep the existing SENTINEL application exactly as currently designed.
The Dashboard, Capture Progress workflow, Log with SENTINEL workflow, Review Queue, Review Match workflow, design system, branding, typography, light/dark modes, spacing, components and interaction patterns are approved.
Do NOT redesign existing screens.
Before building the new Batch 3 screens, apply ONLY these small shell corrections:
1. Ensure the expanded desktop sidebar width is exactly 248px and collapsed width is 72px across the entire application.
2. Remove the duplicate bottom-left user profile block entirely.
Do NOT show:
Arjun Mehta
Planner
in the lower-left sidebar because the signed-in user identity already exists in the top-right application header.
Keep user identity only in the header.
3. Remove the visible text label:
Collapse
from the bottom of the sidebar.
Replace it with a subtle icon-only collapse/expand control integrated into the sidebar edge or lower sidebar area.
Use a small chevron/arrow icon.
Expanded state:
chevron points toward collapse direction.
Collapsed state:
chevron points toward expand direction.
The control should:
- be visually subtle
- use a tooltip on hover such as “Collapse sidebar” / “Expand sidebar”
- be keyboard accessible
- have a visible focus state
- not look like a primary action
- not consume a full navigation row
4. Keep Capture Progress pinned near the bottom of the sidebar.
The final lower sidebar structure should effectively be:
navigation
↓
Capture Progress
↓
subtle collapse arrow
Do not add the user profile back into the sidebar.
5. In Dashboard → Plan vs Actual, fix the “Verified actuals only” supporting text so it is fully contained and never clipped or overflowing.
6. Preserve the current KPI numeric typography exactly. Do not revert the approved number styling.
Do not modify anything else on existing Batch 1 or Batch 2 screens.
Now build ONLY Batch 3:
SCHEDULE
Create these functional screens and states:
1. Schedule — Activities
2. Schedule Activity Detail
3. Schedule — Timeline
4. supporting filters, hierarchy expansion and detail interactions required for these screens
Do NOT build Reports, Exceptions, Actuals, Performance, Data Quality, Execution Knowledge, Audit Log, Administration or Login in this batch.
CORE PURPOSE
SENTINEL is not replacing Primavera P6 or Microsoft Project.
The Schedule area is a trusted execution-facing mirror of the planning schedule.
It must show:
PLANNED WORLD
+
VERIFIED FIELD ACTUALS
+
VARIANCE
+
SOURCE / TRUST CONTEXT
The user should immediately understand where field execution differs from the schedule.
Actual Start and Actual Finish are primary schedule truth.
Percent progress is secondary.
Only verified actuals should be treated as official schedule actuals.
SCHEDULE NAVIGATION
Clicking Schedule in the existing sidebar should open the Schedule workspace.
Inside Schedule use two tabs:
Activities
Timeline
Default tab:
Activities
Keep these tabs inside the page header rather than creating additional sidebar items.
Header:
Schedule
Supporting text:
Compare planned activities with verified field execution.
Right-side actions:
Search
Filters
Export
Export can be visual-only for now.
Do not introduce a new primary orange CTA on this page unless required.
SCHEDULE — ACTIVITIES
Create a professional schedule activity table.
Top area:
Schedule
Activities | Timeline
Below show compact schedule summary information:
68.4% Actual Progress
71.2% Planned Progress
−2.8% Variance
23 Started Late
11 Finished Late
These should be compact inline summary metrics, NOT large Dashboard KPI cards.
Below show toolbar:
Search activities...
Discipline ▾
Area ▾
Status ▾
Variance ▾
Level ▾
Include:
Expand All
Collapse All
ACTIVITY HIERARCHY
Represent realistic L5/L6 schedule hierarchy.
Use indentation and chevrons.
Example:
▾ PIPING WORKS
    ▾ AREA B PIPING
        ERECT LINE 24-XX
        INSTALL PIPE SUPPORT 24-XX
        HYDROTEST LINE 24-XX
▾ ROTATING EQUIPMENT
    ▾ UTILITY BLOCK
        EQUIPMENT ALIGNMENT — P-204
        P-204 INSTALLATION
        P-204 COMMISSIONING
▾ CIVIL WORKS
        FOUNDATION BLOCK C-14
▾ ELECTRICAL
        CABLE TRAY INSTALLATION — UTILITY BLOCK
Make hierarchy visually clear without excessive tree lines.
Use restrained indentation.
ACTIVITY TABLE
Columns:
ACTIVITY
DISCIPLINE
PLANNED START
ACTUAL START
PLANNED FINISH
ACTUAL FINISH
VARIANCE
STATUS
Allow horizontal scrolling only if genuinely needed.
Prioritize keeping important fields visible.
CORE CONSISTENT DEMO DATA
Use the same data everywhere in SENTINEL.
ERECT LINE 24-XX
Level:
L6
Discipline:
Piping
Area:
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
Start Variance:
+2 days
Trust:
Verified
Use a subtle late-start indicator.
Do NOT infer Actual Finish.
EQUIPMENT ALIGNMENT — P-204
Level:
L6
Discipline:
Rotating Equipment
Area:
Utility Block
Planned Start:
27 Aug 2026
Actual Start:
Conflicting
Conflicting field evidence:
26 Aug 2026
27 Aug 2026
Status:
Exception
Do NOT choose one date automatically.
Show a conflict indicator.
FOUNDATION BLOCK C-14
Discipline:
Civil
Status:
Needs Review
Do not treat suggested data as verified schedule truth.
CABLE TRAY INSTALLATION — UTILITY BLOCK
Discipline:
Electrical
Actual Start:
Not reported
Status:
Missing Actual
STATUS VISUAL LANGUAGE
Use restrained statuses:
Verified
In Progress
Started Late
Finished Late
Needs Review
Missing Actual
Conflict
Not Started
Complete
Do not use large colorful pills everywhere.
Use small badges or text + icon.
Orange:
brand / active / selected / moderate attention
Red:
conflict / serious exception only
Purple:
review / AI-suggested state
Neutral gray:
missing / not reported
Green:
verified/completed only where helpful
Never communicate status using color alone.
ACTIVITY ROW INTERACTION
Clicking:
ERECT LINE 24-XX
should open Schedule Activity Detail.
Prefer a full detail page rather than another narrow drawer because this is a core planning entity with substantial information.
Maintain breadcrumb:
Schedule / Activities / ERECT LINE 24-XX
SCHEDULE ACTIVITY DETAIL
Header:
ERECT LINE 24-XX
L6 · Piping · Area B
Status:
In Progress
Trust:
Verified Actual
Header actions:
View Timeline
Open Source Evidence
Do not add Edit Schedule as a normal user action.
SENTINEL is not the master planning tool.
PLAN VS ACTUAL SUMMARY
Create a prominent Plan vs Actual card.
PLANNED
Start:
24 Aug 2026
Finish:
30 Aug 2026
Duration:
6 days
ACTUAL
Start:
26 Aug 2026
Finish:
Not reported
Current Status:
In Progress
VARIANCE
Start:
+2 days late
Finish:
Cannot determine
Do NOT estimate finish variance when Actual Finish is missing.
Explicitly show:
Finish variance unavailable until completion is reported.
EXECUTION TIMELINE
Below show:
Execution Timeline
24 Aug
Planned Start
26 Aug
Actual Start
Verified
28 Aug
Latest Field Update
Final bolt tightening pending
30 Aug
Planned Finish
Use a clean horizontal or vertical timeline depending on space.
The execution timeline should visually differentiate:
planned events
verified actuals
field evidence
LATEST FIELD CONTEXT
Show:
Latest Field Context
“Spool erected in Area B.
Final bolt tightening pending.”
Source:
Supervisor Update
Reported:
26 Aug 2026 · 08:42
Trust:
Verified
Actions:
View Evidence
View Actual
Preserve the original field wording exactly.
LINKED ACTUALS
Create section:
Linked Actuals
Show compact records:
ACT-2026-0842
Actual Start
26 Aug 2026
Source:
Supervisor Update
Status:
Verified
Reviewed by:
Arjun Mehta
Do not invent multiple records unnecessarily.
DATA TRUST
Create a compact card:
Data Trust
Schedule Match:
Verified
Match Confidence:
91%
Reviewed By:
Arjun Mehta
Review Date:
28 Aug 2026
Source Evidence:
Available
Clearly distinguish:
AI confidence
from
human verification
91% is historical AI confidence.
Verified is the human-approved relationship.
MATCH HISTORY
Create section:
Match History
Show:
26 Aug 08:42
Actual captured
26 Aug 08:43
SENTINEL suggested
ERECT LINE 24-XX
91%
28 Aug 10:44
Match verified
Arjun Mehta
Do NOT expose internal chain-of-thought.
SCHEDULE UPDATE
Create compact section:
Schedule Update
Actual Start
—
→
26 Aug 2026
Status:
Applied
Updated:
28 Aug 2026 · 10:44
This represents the prototype schedule mirror/write-back.
Do not claim live Primavera integration.
Use supporting label:
SENTINEL Schedule Mirror
if useful.
AUDIT PREVIEW
At the bottom show a compact preview:
Recent Activity
Match verified
Arjun Mehta
28 Aug · 10:44
Actual Start updated
26 Aug 2026
28 Aug · 10:44
View Full Audit Log
The Audit Log page itself will be built later.
SCHEDULE — TIMELINE
Build the Timeline tab as a professional Gantt-like execution comparison.
This is NOT a full Primavera replacement.
Focus on comparing planned and actual timing.
Header remains:
Schedule
Activities | Timeline
Toolbar:
Search
Discipline
Area
Status
Date Range
Default range:
Aug 2026
TIMELINE STRUCTURE
Left frozen activity column.
Right timeline area.
Rows should align with schedule activities.
Example rows:
ERECT LINE 24-XX
EQUIPMENT ALIGNMENT — P-204
FOUNDATION BLOCK C-14
CABLE TRAY INSTALLATION — UTILITY BLOCK
Use:
planned bar:
muted slate / neutral
verified actual:
brand orange
suggested/unverified:
purple outline or dashed treatment
missing actual:
neutral marker
conflict:
red warning marker
ERECT LINE TIMELINE
ERECT LINE 24-XX
Planned:
24–30 Aug
Actual Start:
26 Aug
Actual Finish:
Not reported
Show the planned bar from 24–30.
Show verified Actual Start marker at 26.
Do NOT create an actual completion bar extending to 30.
Instead indicate:
In Progress
and optionally extend a subtle current-progress line only if clearly differentiated from Actual Finish.
Never fabricate completion.
P-204 TIMELINE
EQUIPMENT ALIGNMENT — P-204
Show conflict at Actual Start.
Two evidence markers:
26 Aug
27 Aug
Use a clear conflict indicator.
Tooltip / hover:
Conflicting Actual Start
2 field sources require resolution
Do not choose one automatically.
TIMELINE TODAY MARKER
Current demo date:
28 Aug 2026
Use a subtle vertical Today line.
Label:
28 Aug
Do not make it bright or dominant.
TIMELINE INTERACTIONS
Hovering a schedule item should show:
Activity
Discipline
Area
Planned dates
Verified actual dates
Variance
Trust status
Clicking an activity opens Schedule Activity Detail.
Allow hierarchy expansion/collapse from Timeline as well.
FILTER BEHAVIOR
Filters should visually work using mock state.
Example:
Discipline:
Piping
should reduce the activity list to Piping hierarchy/items.
Include:
Clear Filters
Do not build backend querying.
EMPTY / MISSING STATES
Support:
No Actual Reported
Example text:
No verified field execution has been linked to this activity yet.
Do NOT display:
0% Actual
unless 0% is actually known.
Missing is not zero.
TRUST RULES
Mandatory across Schedule:
1. Verified actuals are official schedule truth.
2. AI Suggested is not Verified.
3. Missing data must show “Not reported”.
4. Do not invent Actual Finish.
5. Do not infer completion from “final bolt tightening pending”.
6. Conflict preserves both sources.
7. Confidence is not approval.
8. Historical AI recommendation remains visible after human decision.
9. Schedule activity data and Actual Event data remain separate entities.
10. SENTINEL is a schedule reconciliation layer, not a replacement planning engine.
VISUAL PRIORITY
The Schedule experience should feel:
precise
professional
dense but readable
high-trust
project-controls oriented
Think:
Apple clarity
+
professional planning software density
Avoid:
giant cards
giant metrics
neon
sci-fi
excessive glass
excessive orange
excessive status pills
generic SaaS dashboard styling
RESPONSIVE
Desktop:
full activity table and timeline.
Tablet:
hide lower-priority columns such as discipline/area when necessary.
Mobile:
do not attempt a desktop Gantt squeezed onto the screen.
Activities become compact cards.
Timeline becomes a simplified activity-by-activity planned vs actual view.
Activity Detail becomes single-column.
ACCESSIBILITY
Maintain:
keyboard navigation
visible focus states
semantic table structure
tooltips for abbreviated content
accessible hierarchy expansion
status text in addition to color
proper contrast in both light and dark modes
FINAL RULE
Build ONLY Schedule Activities, Schedule Activity Detail and Schedule Timeline in this batch.
Reuse the existing SENTINEL components and mock data.
Do not modify approved Batch 1 or Batch 2 workflows beyond the shell corrections stated at the beginning.
Do not add backend/database functionality.
Do not add a chatbot.