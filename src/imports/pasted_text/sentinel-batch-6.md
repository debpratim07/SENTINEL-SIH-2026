SENTINEL — BATCH 6
Carry-forward fixes + Performance + Data Quality + Execution Knowledge
Keep the existing SENTINEL application exactly as currently designed.
Batches 1–5 are approved structurally.
Preserve:
- SENTINEL branding and exact logo
- app shell
- light/dark themes
- typography
- Dashboard
- Capture Progress
- Log with SENTINEL
- Review Queue / Review Match
- Schedule
- Reports / Report Analysis
- Actuals / Actual Detail
- Exceptions / Resolution flows
- existing navigation
- centralized mock data
- existing interaction patterns
Do NOT redesign approved screens.
Before building Batch 6, apply ONLY the carry-forward fixes below.
PART A — CARRY-FORWARD FIXES
A1 — ACTUALS TABLE RIGHT-SIDE CLIPPING
The Actuals table currently clips/truncates the right-most:
TRUST / STATUS
column.
For example:
Awaiting Clarification
is partially cut off.
Fix the responsive table layout.
Requirements:
- every status must be fully readable
- do not truncate important trust/status text
- rebalance column widths where possible
- if horizontal scrolling is necessary on smaller desktop widths, implement it cleanly
- keep the Actual/activity column readable
- do not shrink typography excessively
- preserve professional table density
- preserve row alignment
- maintain accessibility
On standard desktop widths, prioritize visible columns:
Actual
Event
Discipline
Area
Date
Schedule Link
Trust / Status
Source may compress slightly before Trust / Status becomes clipped.
A2 — MATERIAL SHIFTING DATA CORRECTION
The Actual:
Material shifting
must NOT be arbitrarily classified as Civil unless evidence supports that discipline.
Use:
Discipline:
Not reported
or leave discipline explicitly unspecified.
Keep:
Area:
Area B
Schedule Link:
Not linked
Status:
Unmatched
Never invent discipline information.
A3 — ACTUAL ID READABILITY
Secondary Actual IDs such as:
ACT-2026-0860
are currently slightly too faint.
Increase their contrast modestly.
Keep them visually secondary to the Activity name.
Do NOT make IDs visually dominant.
A4 — EXCEPTION DETAIL CROSS-LINK
On Exception Detail, add:
View Schedule Activity
alongside existing:
View Actual
View Source Evidence
when the exception has a known schedule activity.
For:
EQUIPMENT ALIGNMENT — P-204
View Schedule Activity should open the corresponding Schedule Activity Detail.
A5 — EXCEPTION SECTION HEADING
Change the exception detail heading:
RESOLUTION
to:
WHAT CAN I DO?
Maintain the existing layout and actions.
The final exception hierarchy should explicitly read:
WHAT HAPPENED
WHY THIS IS A PROBLEM
WHAT CAN I DO?
Do not otherwise redesign the conflict screen.
PART B — BUILD BATCH 6
Build ONLY:
1. Performance — Project
2. Performance — Discipline
3. Data Quality
4. Execution Knowledge
5. Execution Knowledge Pattern Detail
Do NOT build yet:
- Audit Log
- Administration
- Login
- Global Search
- Notifications
- Profile
- SENTINEL Guide
Those belong to Batch 7.
CORE INSIGHTS PRINCIPLE
SENTINEL Insights must be grounded in trusted execution data.
Official project-performance metrics must use:
VERIFIED ACTUAL EVENTS ONLY
Do not silently mix:
AI Suggested
Needs Review
Incomplete
Unmatched
Conflicting
into official performance values.
Where unverified data is discussed, label it explicitly.
Insights must help answer:
How is the project performing?
Where is execution deviating from plan?
Where is the underlying data weak?
What repeatable execution patterns are emerging?
PART C — PERFORMANCE
Make the existing:
Performance
sidebar navigation functional.
Performance contains two internal tabs:
Project
Disciplines
Default:
Project
Do not create separate sidebar entries.
PERFORMANCE — PROJECT
Header:
Performance
Supporting text:
Track verified execution against the project plan.
Tabs:
Project | Disciplines
Top-right:
Date Range
Default:
Aug 2026
Optional:
Export
Export may remain visual-only.
PERFORMANCE SUMMARY
Use moderately compact KPI cards or summary tiles.
Do NOT make them as large as Dashboard KPIs.
Show:
Overall Progress
68.4%
Plan:
71.2%
Variance:
−2.8%
Supporting:
Verified actuals only
Started Late
23
Supporting:
5 require attention
Finished Late
11
Supporting:
3 over 5 days
Verified Actuals
1,042
Supporting:
81.2% of reported execution events
Review Backlog
7
Supporting:
3 low confidence
The page should clearly communicate that performance numbers are based on verified records.
PLAN VS ACTUAL TREND
Create a main chart:
Plan vs Actual Progress
Period:
1 Aug → 28 Aug 2026
Use:
Plan:
muted slate dashed/neutral line
Actual:
SENTINEL orange
Example trend should end at:
Plan:
71.2%
Actual:
68.4%
Variance:
−2.8%
Provide:
Verified actuals only
as supporting context.
Do not fabricate precision beyond the demo.
VARIANCE TREND
Create a smaller analytical section:
Schedule Variance Trend
Show whether execution has moved closer to or further from plan through August.
Use restrained chart treatment.
Avoid excessive chart colors.
START / FINISH PERFORMANCE
Create a section:
Execution Timing
Show:
Started On Time
Started Late
Finished On Time
Finished Late
Missing Actual Start
Missing Actual Finish
Do not represent missing actuals as late.
Missing ≠ late.
Missing ≠ zero.
Use readable horizontal bars or compact distribution visualization.
DISCIPLINE PERFORMANCE OVERVIEW
Show:
Discipline Performance
Table or compact chart.
Use these demo values:
Piping
Plan:
69%
Actual:
64%
Variance:
−5%
Status:
Behind
Civil
Plan:
74%
Actual:
72%
Variance:
−2%
Status:
Slightly Behind
Rotating Equipment
Plan:
70%
Actual:
68%
Variance:
−2%
Status:
Slightly Behind
Electrical
Plan:
73%
Actual:
75%
Variance:
+2%
Status:
Ahead
Instrumentation
Plan:
66%
Actual:
61%
Variance:
−5%
Status:
Behind
Use verified actuals only.
Clicking a discipline should open:
Performance → Discipline
PERFORMANCE — DISCIPLINE
Use:
Piping
as the hero detail.
Breadcrumb:
Performance / Piping
Header:
Piping Performance
Supporting:
Verified field execution compared with planned schedule performance.
Summary:
Actual Progress:
64%
Plan:
69%
Variance:
−5%
Started Late:
8
Finished Late:
4
Verified Actuals:
286
Review Backlog:
3
DISCIPLINE TREND
Show:
Piping — Plan vs Actual
Use an August trend.
Plan line:
neutral/slate
Actual:
orange
Keep chart visually consistent with Project Performance.
TIMING BREAKDOWN
Show:
Start Performance
On Time:
62%
Late:
28%
Missing:
10%
Finish Performance
On Time:
67%
Late:
21%
Missing:
12%
These are prototype numbers.
Do not treat missing records as late.
TOP DELAYED ACTIVITIES
Show a compact table/list:
ERECT LINE 24-XX
Start Variance:
+2 days
Status:
In Progress
PIPE SUPPORT INSTALLATION — AREA B
Variance:
+3 days
HYDROTEST LINE 18-AB
Variance:
+2 days
Rows may link to Schedule Activity Detail.
DISCIPLINE EXECUTION SIGNALS
Show a compact insight block:
Current Execution Signals
Examples:
5 activities started later than plan this week.
Bolt tightening appears repeatedly in delayed Piping completion records.
3 Piping Actual Events remain in review.
Important:
Do not portray these as certainty/prediction.
Use wording such as:
Observed pattern
or
Historical signal
when appropriate.
PART D — DATA QUALITY
Make existing:
Data Quality
sidebar entry functional.
Header:
Data Quality
Supporting text:
Understand the completeness, traceability and reliability of execution data.
Do NOT create one giant generic:
AI Quality Score
or
Data Quality Score
unless a clearly defined formula exists.
Prefer several understandable dimensions.
DATA QUALITY SUMMARY
Use compact metric cards:
Source Coverage
94%
Supporting:
Execution events with traceable source evidence
Match Confidence
89%
Supporting:
Average confidence across matched candidates
Important:
This is NOT the same as verification rate.
Missing Data
4.2%
Supporting:
Actuals missing key execution context
Unmatched Rate
2.8%
Supporting:
Actual Events without a safe schedule relationship
Review Backlog
7
Supporting:
Requires human decision
DATA QUALITY DIMENSIONS
Create a clear analytical section:
Data Quality Breakdown
Include:
Evidence Coverage
Completeness
Schedule Linkage
Review Health
Conflict Rate
Source Consistency
Show each independently.
Do not collapse everything into one unexplained score.
MISSING DATA ANALYSIS
Create:
Missing Information
Show common missing fields:
Area
Line / Equipment Reference
Actual Date
Discipline
Activity Detail
Example:
Area
18 records
Line / Equipment Reference
14 records
Actual Date
7 records
Discipline
5 records
Clicking a field may visually filter affected Actuals.
No backend required.
UNMATCHED ANALYSIS
Show:
Unmatched Actuals
48
Breakdown by reason:
Broad terminology
Missing reference
Multiple candidate activities
Potential schedule gap
Include:
View Unmatched Actuals
which routes to Actuals with an Unmatched filter or Exceptions where appropriate.
REVIEW HEALTH
Show:
Review Health
Pending:
7
Low Confidence:
3
Ambiguous:
2
Incomplete:
2
Median Review Time:
18 min
These can be prototype values.
Do not claim production analytics.
SOURCE QUALITY
Show:
Source Coverage by Type
Supervisor Updates
Daily Progress Reports
Spreadsheets
Manual Entries
Site Diaries
Example metrics may show percentage with usable source evidence.
Do not imply that one source type is inherently trustworthy just because it exists.
CONFLICT / DUPLICATE QUALITY
Show compact section:
Reconciliation Issues
Open Conflicts:
1
Potential Duplicates:
2
Unmatched:
48
Awaiting Clarification:
6
Link these to relevant Actuals/Exceptions filters.
DATA QUALITY TRUST RULE
Distinguish carefully:
High AI confidence
from
Verified relationship
from
Complete data
These are three different concepts.
An Actual can be:
high-confidence but unverified
verified but still missing non-critical metadata
complete but unmatched
Do not collapse these states.
PART E — EXECUTION KNOWLEDGE
Make existing:
Execution Knowledge
navigation functional.
Header:
Execution Knowledge
Supporting text:
Learn from verified historical execution patterns.
Important:
Execution Knowledge must be based primarily on:
verified historical Actual Events
and
verified schedule relationships.
Do not build generic AI-generated insights.
EXECUTION KNOWLEDGE SUMMARY
Use compact metrics:
Verified Samples
1,042
Observed Activity Patterns
36
Recurring Bottlenecks
8
Disciplines Covered
6
Supporting text:
Generated from verified project execution history.
PATTERN LIST
Create a professional list/table of execution patterns.
Columns:
PATTERN
DISCIPLINE
VERIFIED SAMPLES
PLANNED DURATION
OBSERVED ACTUAL
VARIANCE
SIGNAL
Hero pattern:
ERECT LINE
Discipline:
Piping
Verified Samples:
18
Average Planned Duration:
6.2 days
Average Actual Duration:
7.4 days
Variance:
+1.2 days
Signal:
Recurring delay
Second:
PIPE SUPPORT INSTALLATION
Piping
Verified Samples:
24
Planned:
3.6 days
Actual:
3.9 days
Variance:
+0.3 days
Signal:
Stable
Third:
EQUIPMENT ALIGNMENT
Rotating Equipment
Verified Samples:
12
Planned:
2.8 days
Actual:
3.4 days
Variance:
+0.6 days
Signal:
Review
HERO EXECUTION KNOWLEDGE PATTERN
Click:
ERECT LINE
to open:
Pattern Detail
Breadcrumb:
Execution Knowledge / ERECT LINE
Header:
ERECT LINE
Piping
Supporting:
Observed from 18 verified execution samples.
Do not call this a prediction model.
PATTERN SUMMARY
Show:
Verified Samples:
18
Average Planned Duration:
6.2 days
Average Actual Duration:
7.4 days
Observed Variance:
+1.2 days
Completion Within Plan:
39%
These are historical observations.
Clearly label:
Historical Pattern
DURATION DISTRIBUTION
Create a simple chart:
Planned vs Observed Duration
Show historical observed distribution without implying future certainty.
Avoid prediction intervals unless explicitly modeled.
RECURRING BOTTLENECKS
Show:
Recurring Bottlenecks
1. Final bolt tightening
Observed in:
9 of 18 verified samples
Typical contribution:
Late-stage completion delay
2. Material availability
Observed in:
5 of 18 samples
3. Access / work-front readiness
Observed in:
4 of 18 samples
Do not state causal certainty.
Use wording:
Observed association
or
Frequently reported alongside delay
where appropriate.
EXECUTION SEQUENCE
Show:
Common Execution Sequence
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
This should be based on historical verified evidence.
Do not claim every activity follows this exact sequence.
Label:
Common observed sequence
RELATED FIELD LANGUAGE
Show:
Common Field Terminology
Examples:
“spool erected”
“line erection completed”
“final bolt tightening pending”
“alignment completed”
Explain that SENTINEL has seen these terms in verified mappings to ERECT LINE-type activities.
This demonstrates the lightweight Execution Knowledge layer helping terminology normalization.
SCHEDULE RELEVANCE
Show:
Why this matters
Historical ERECT LINE activities tend to run approximately:
1.2 days longer than planned
in the current verified project dataset.
Common late-stage signal:
Final bolt tightening pending
Supporting text:
Historical observation only. Does not automatically change future schedule durations.
Very important:
Execution Knowledge must NOT automatically rewrite schedule durations.
Human planners remain responsible for schedule decisions.
RELATED ACTIVITIES
Show compact links to:
ERECT LINE 24-XX
other representative verified examples
Do not generate dozens of fake records.
KNOWLEDGE TRACEABILITY
Provide lightweight provenance:
18 Verified Actual Events
↓
18 Human-verified schedule relationships
↓
Observed duration + terminology patterns
This is important for trust.
Allow:
View Supporting Records
which may visually open/filter Actuals.
EXECUTION KNOWLEDGE RULES
1. Use verified execution history.
2. Clearly label historical observation vs suggestion.
3. Do not imply statistical certainty without evidence.
4. Do not automatically change schedule durations.
5. Do not present correlation as proven causation.
6. Preserve sample size.
7. Show provenance.
8. Avoid generic AI prose.
9. Prefer measurable patterns.
10. Missing/unverified data must not silently enter official historical metrics.
PART F — CROSS-LINKING
Performance should link to:
Schedule Activity Detail
Actuals
Discipline Performance
Data Quality where relevant
Data Quality should link to:
filtered Actuals
Exceptions
Review Queue
Execution Knowledge should link to:
supporting Actuals
Schedule Activities
Do not create disconnected analytics pages.
PART G — VISUAL DIRECTION
Insights pages should feel like:
operational intelligence
not
generic BI dashboards.
Use:
professional density
clear hierarchy
restrained charts
trust labels
meaningful drill-down
Keep Apple-style clarity.
Avoid:
giant donut charts
20 tiny charts on one screen
bright rainbow visualization
excessive gradients
AI sparkle icons
generic “AI Insights” cards
chatbot copy
huge KPI cards
excessive glass
CHART COLOR SYSTEM
Keep chart colors restrained.
Prefer:
orange:
verified Actual / SENTINEL focus
slate/gray:
Plan / baseline
green:
positive verified state where necessary
red:
meaningful negative/conflict only
purple:
review/suggested where applicable
Do not use different arbitrary colors for every discipline unless necessary.
Use text/labels as well as color.
LIGHT / DARK MODE
All Batch 6 pages must support the existing themes.
Dark mode:
charcoal, not pure black.
Charts must remain readable.
Gridlines subtle.
Orange not oversaturated.
Tooltip contrast must remain accessible.
RESPONSIVENESS
Desktop:
full analytical layouts.
Tablet:
stack secondary charts and reduce table columns.
Mobile:
prioritize key metrics and simple charts.
Tables become cards where required.
Do not squeeze complex charts into unreadable widths.
ACCESSIBILITY
Maintain:
semantic headings
accessible charts with textual summaries
keyboard navigation
visible focus states
proper tooltip behavior
status meaning not communicated solely by color
good light/dark contrast
appropriate table semantics
DATA CONSISTENCY
Continue using:
Overall Actual:
68.4%
Plan:
71.2%
Variance:
−2.8%
Started Late:
23
Finished Late:
11
Review:
7
Exceptions:
3
Core schedule truth:
ERECT LINE 24-XX
Planned Start:
24 Aug 2026
Actual Start:
26 Aug 2026
Planned Finish:
30 Aug 2026
Actual Finish:
Not reported
Do not introduce contradictory values on Insight pages.
FINAL RULE
Build ONLY:
Performance — Project
Performance — Discipline
Data Quality
Execution Knowledge
Execution Knowledge Pattern Detail
plus the five carry-forward fixes at the beginning.
Do NOT build:
Login
Administration
Audit Log
Notifications
Profile
Global Search
SENTINEL Guide
Do NOT add:
backend
database
real analytics pipeline
chatbot
Do not redesign previous batches.
Stop when Batch 6 is complete.