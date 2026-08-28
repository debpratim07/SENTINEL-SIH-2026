Fix ONLY the existing SENTINEL navigation CTAs and arrow links. Do NOT redesign any page and do NOT add new features.
Current problem:
Many existing text links and arrow CTAs look clickable but do nothing.
Examples include:
View →
Resolve →
Inspect →
Review →
View All →
View Schedule →
View Actuals →
View Queue →
View Details →
View Audit Log →
and similar existing navigation actions throughout the application.
These controls must now perform real prototype navigation using the existing SENTINEL routes/screens and centralized mock state.
IMPORTANT:
Scan the ENTIRE existing application for visible navigation controls, especially text links/buttons containing arrows such as →, and connect every valid navigation CTA to its already-existing destination.
Do not leave visual-only navigation links.
==================================================
DASHBOARD NAVIGATION
Dashboard → Plan vs Actual:
View Schedule →
must open:
Schedule → Activities
Dashboard → Needs Attention:
View → on ERECT LINE 24-XX
must open:
Schedule Activity Detail → ERECT LINE 24-XX
Resolve → on EQUIPMENT ALIGNMENT — P-204
for Planner / Project Controls:
open the existing P-204 Exception Detail
for Project Manager:
use read-only behavior and label/navigation equivalent to:
View Conflict →
Do not expose resolution actions to Project Manager.
Inspect → on CABLE TRAY INSTALLATION — UTILITY BLOCK
must open the relevant Actual / Schedule context showing the missing Actual Start.
Review → on FOUNDATION BLOCK C-14
for Planner / Project Controls:
open the relevant Review Queue item / Review Match workflow
for read-only roles:
open the record in read-only mode.
View All → in Needs Attention
must open the appropriate combined attention destination, preferably Review Queue / Exceptions context using existing screens.
==================================================
DASHBOARD LOWER SECTIONS
View Actuals →
must open:
Actuals
View Queue →
must open:
Review Queue
View Details → inside Data Quality
must open:
Data Quality
View Audit Log →
must open:
Audit Log
while respecting role permissions.
If the active role does not have Audit Log access:
do not navigate to a forbidden page.
Use the existing permission behavior.
==================================================
PERFORMANCE
Any discipline row or CTA intended for drill-down must open:
Performance → Discipline
Example:
Piping
→ Piping Performance
Any delayed schedule activity link should open its existing Schedule Activity Detail.
==================================================
DATA QUALITY
Existing drill-down actions should work.
Examples:
Unmatched records
→ filtered Actuals / Exceptions
Review backlog
→ Review Queue where permitted
Conflicts
→ Exceptions
Missing Data
→ Actuals filtered to relevant incomplete records
Do not create new pages for these actions.
Use existing pages with mock filters where possible.
==================================================
EXECUTION KNOWLEDGE
Clicking an Activity Pattern row such as:
ERECT LINE
must open:
Execution Knowledge → ERECT LINE Pattern Detail
Any existing:
View Supporting Records
action must navigate to the relevant Actuals view/filter.
Any linked schedule activity must open the existing Schedule Activity Detail.
==================================================
REPORTS
Report rows must open:
Report Analysis
Example:
Piping_DPR_28Aug.pdf
→ Report Analysis for Piping_DPR_28Aug.pdf
Existing:
View Original
→ Source Evidence Viewer
Review Match
→ existing Review Match interaction
==================================================
ACTUALS
Actual rows must open:
Actual Detail
Example:
ACT-2026-0842
→ ACT-2026-0842 Actual Detail
Existing links:
View Schedule Activity
→ corresponding Schedule Activity Detail
View Source Evidence
→ Source Evidence Viewer
View Exception
→ related Exception Detail
==================================================
EXCEPTIONS
Exception rows must open:
Exception Detail
Existing links:
View Actual
→ corresponding Actual Detail
View Source Evidence
→ evidence viewer
View Schedule Activity
→ corresponding Schedule Activity Detail
Do not bypass permission restrictions.
==================================================
REVIEW QUEUE
Clicking a Review Queue row must open:
Review Match
for the selected Actual Event.
The selected row and Review Match content must remain synchronized.
==================================================
AUDIT
View Audit Log →
must open Audit Log where permitted.
Audit table rows should open the existing Audit Detail drawer.
Related Evidence
→ evidence viewer
Related Actual
→ Actual Detail
Related Schedule Activity
→ Schedule Activity Detail
==================================================
GLOBAL SEARCH
Preserve existing search behavior.
Search result clicks must route correctly:
Schedule Activity
→ Schedule Activity Detail
Actual Event
→ Actual Detail
Report
→ Report Analysis
Exception
→ Exception Detail
Page
→ corresponding existing page
==================================================
NOTIFICATIONS
Preserve existing notification navigation.
Notification click destinations:
FOUNDATION BLOCK C-14 review
→ relevant Review Queue item
P-204 conflict
→ P-204 Exception Detail
Piping_DPR_28Aug.pdf processed
→ Report Analysis
Welding clarification
→ relevant Actual / Exception
ERECT LINE verification
→ relevant Actual or Schedule Activity
==================================================
NAVIGATION IMPLEMENTATION RULES
Use the application's existing routing/navigation system.
Do NOT use placeholder alerts such as:
"Coming soon"
Do NOT create duplicate pages.
Do NOT reload the entire application when navigating.
Use client-side prototype navigation.
Preserve:
sidebar state
active role
light/dark theme
mock data
permissions
When navigating to a detail record, load the correct selected record from existing mock state.
Add proper pointer/click behavior to links and buttons.
Visible clickable navigation controls must:
- use pointer cursor
- work with mouse click
- work with keyboard Enter/Space where appropriate
- have visible focus state
- preserve hover styling
==================================================
ROLE PERMISSIONS
Navigation must remain role-aware.
Do not allow a visual link to bypass permissions.
Example:
Project Manager may open and VIEW a conflict but must not gain Resolve Conflict authority.
Administrator must not gain Planner verification authority through direct navigation.
If a destination itself is unavailable to the active role:
either hide the navigation action where appropriate
or show the existing Access Restricted state.
==================================================
GLOBAL CTA AUDIT
Perform a full scan of the existing SENTINEL UI for all controls that appear navigational.
This includes:
- arrow links
- View buttons
- View All
- View Details
- View Schedule
- View Actual
- View Actuals
- View Queue
- View Audit Log
- Review
- Inspect
- Resolve / View Conflict
- table rows intended to open details
- breadcrumbs where already designed
- cards/rows with drill-down affordances
If a control visually communicates that it opens another existing screen, make it actually do so.
Do NOT make destructive or consequential buttons automatically execute actions during this navigation fix.
This task is about navigation only.
==================================================
FINAL RULE
Fix navigation behavior only.
Do NOT redesign:
Dashboard
Schedule
Reports
Actuals
Exceptions
Review Queue
Performance
Data Quality
Execution Knowledge
Audit
Administration
Login
Global Search
Notifications
Do NOT add backend/database functionality.
Do NOT add new pages.
Do NOT change existing demo data.
After this fix, there should be no visible arrow/link CTA in SENTINEL that looks navigational but does nothing.