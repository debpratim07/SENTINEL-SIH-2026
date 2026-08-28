Keep the existing SENTINEL application shell, Dashboard, visual language, colors, typography, dark mode, card system, spacing, and branding. Do NOT redesign the existing Dashboard.
First apply these pending corrections to the existing Dashboard while preserving everything else:
1. Set expanded desktop sidebar width to exactly 248px and collapsed width to 72px.
2. Replace the top-right Capture Progress camera-style icon with the same plus/add icon language used by the sidebar action.
3. Fix the Plan vs Actual summary panel so the “Verified actuals only” text is fully contained and does not overflow or feel cramped.
4. Preserve the current improved KPI numeric typography exactly. Do not revert 68.4%, 23, 11, 7, 3, or other major metrics to a monospace-looking style.
5. Preserve the current dark mode, restrained orange usage, glass treatment, Dashboard hierarchy, five KPI cards, Needs Attention structure, and project selector.
After those corrections, build the next SENTINEL hero workflow using the SAME existing design system and reusable components.
Create ONLY the following new functional surfaces:
1. Capture Progress chooser
2. Log with SENTINEL large right-side drawer
3. Natural-language input state
4. Clarification state
5. Structured Actual preview
6. Schedule Match preview
7. Submission success state
8. Review Queue page
9. Review Match right-side drawer
10. Choose Schedule Activity nested modal
11. Mark Unmatched confirmation
12. Request Clarification interaction
Do NOT generate Schedule pages, Reports pages, Exceptions pages, Performance pages, Data Quality pages, Execution Knowledge pages, Audit Log, Administration, or Login yet.
==================================================
CORE PRODUCT RULE
SENTINEL must visually communicate this sequence:
FIELD WORDING
→ STRUCTURED ACTUAL
→ AI SUGGESTION
→ EXPLANATION
→ ALTERNATIVES
→ HUMAN DECISION
→ VERIFIED SCHEDULE TRUTH
AI Suggested must NEVER visually look the same as Verified.
The interface must feel like serious operational software with an intelligent reconciliation layer, not a chatbot product.
==================================================
CAPTURE PROGRESS CHOOSER
The existing + Capture Progress action should now open a compact chooser.
Title:
Capture Progress
Supporting text:
Choose how you want to record field execution.
Show 3 options:
1. Log with SENTINEL
   Describe what happened in your own words.
2. Upload Report
   Add a DPR, spreadsheet or site diary.
3. Manual Entry
   Enter a structured actual directly.
For this batch:
- Log with SENTINEL should be fully functional.
- Upload Report may remain a placeholder route for later Batch.
- Manual Entry may remain a placeholder route for later Batch.
Visually emphasize Log with SENTINEL slightly using a subtle orange tint.
Do NOT style this like a chatbot launcher.
==================================================
LOG WITH SENTINEL DRAWER
Open as a large right-side drawer.
Recommended desktop width:
approximately 620px.
Use the existing glass material and design system.
Header:
Log Progress
Supporting text:
Describe what happened on site.
SENTINEL will structure the update and connect it to the schedule.
Do NOT show a large AI avatar, bot icon, or chat bubbles.
==================================================
INITIAL INPUT STATE
Main prompt:
What happened on site?
Use a large natural-language textarea.
Placeholder:
Describe the activity, location, equipment and what changed...
Use this demo input:
Pump P-204 alignment started this morning.
Under the textarea optionally show small helper chips:
Activity started
Activity completed
Work on hold
These are suggestions only, not required selections.
Also include a tertiary action:
- Add Evidence
Supporting types:
Photo
Document
Note
Evidence is optional.
Footer:
Cancel
Continue
Continue should be the primary gradient action.
==================================================
PROCESSING / UNDERSTANDING STATE
After Continue, preserve the original user statement near the top:
Your update
“Pump P-204 alignment started this morning.”
Then show:
Understanding update
Use a concise processing stepper:
✓ Activity identified
✓ Event identified
✓ Equipment identified
→ Checking project context
Do not show “AI is thinking”.
Do not use fake percentages.
==================================================
CLARIFICATION STATE
SENTINEL should detect:
Activity:
Pump P-204 alignment
Event:
Actual Start
Equipment:
P-204
Then ask only ONE required clarification:
Which project area did this occur in?
Options:
Utility Block
Area A
Area B
Tank Farm
Other
I don't know
Use clean selectable buttons/chips.
Selected:
subtle orange tint.
For the demo, selecting Utility Block continues the flow.
Important:
SENTINEL must NEVER ask the supervisor which L5/L6 schedule activity this belongs to.
If the user selects “I don't know”, allow them to continue and explain:
That’s okay.
The update can still be recorded and may require planner review before it affects the schedule.
==================================================
STRUCTURED ACTUAL PREVIEW
After clarification, show:
Review Captured Actual
ACTUAL EVENT
Activity:
Pump P-204 alignment
Event:
Actual Start
Discipline:
Rotating Equipment
Area:
Utility Block
Equipment:
P-204
Reported Time:
Morning · 28 Aug 2026
Use clean two-column field rows.
Label inferred values subtly.
For example:
Rotating Equipment
Inferred
Immediately below show:
ORIGINAL STATEMENT
“Pump P-204 alignment started this morning.”
This original wording must remain visible.
Actions:
Edit
Confirm Actual
Edit should allow inline field correction rather than navigating to a totally separate form.
Important:
Do NOT invent a precise clock time.
If the report says “this morning”, show “Morning · 28 Aug 2026”.
==================================================
MATCH PROCESSING STATE
After Confirm Actual show:
Finding schedule activity
Stepper:
✓ Checking equipment reference
✓ Checking discipline
✓ Checking area
→ Comparing schedule terminology
○ Ranking candidates
Keep this brief and restrained.
==================================================
MATCH PREVIEW
Show:
Likely Schedule Match
EQUIPMENT ALIGNMENT — P-204
L6 · Rotating Equipment · Utility Block
93% confidence
Strong match
This must be visually styled as AI Suggested, NOT Verified.
Below:
Why this match?
✓ Equipment P-204
✓ Rotating Equipment
✓ Utility Block
✓ Strong terminology match
Then:
2 alternative matches
Expandable alternatives:
P-204 INSTALLATION — 42%
P-204 COMMISSIONING — 21%
Do not force the Supervisor to choose between schedule candidates.
==================================================
SUBMIT STATE
Footer:
Back
Submit Progress
Supporting note:
This relationship will follow the project's review policy before becoming verified schedule truth.
After Submit show:
Progress submitted
Your execution update has been recorded.
Status:
Awaiting Review
Likely Match:
EQUIPMENT ALIGNMENT — P-204
Actions:
View Actual
Log Another Update
Done
Do NOT show Verified.
==================================================
INCOMPLETE VARIANT
Support a second demo path:
Input:
Cable work started.
Detected:
Event:
Actual Start
Discipline:
Electrical
Missing:
Area:
Not reported
Specific Activity:
Not reported
If the user does not know the missing context, allow:
Submit for Review
Result:
Progress recorded
Status:
Incomplete — Needs Review
Capture must succeed even if matching is incomplete.
==================================================
REVIEW QUEUE PAGE
Add a new functional page under the existing Review Queue navigation item.
Page title:
Review Queue
Supporting text:
Validate execution events before they affect the project schedule.
Show:
7 pending
Use compact filter tabs:
All 7
Low Confidence 3
Ambiguous 2
Incomplete 2
Unmatched 1
Do NOT use giant KPI cards.
Toolbar:
Search execution events...
Discipline ▾
Area ▾
Source ▾
Confidence ▾
Sort ▾
==================================================
REVIEW QUEUE TABLE
Columns:
EVENT
SUGGESTED ACTIVITY
DISCIPLINE
SOURCE
CONFIDENCE
STATUS
Use this primary demo row:
Spool erected in Area B.
Final bolt tightening pending.
Secondary:
Actual Start · 26 Aug
Suggested Activity:
ERECT LINE 24-XX
Discipline:
Piping
Source:
Supervisor Update
Confidence:
91%
Status:
Needs Review
Use additional realistic rows based on the same SENTINEL demo data.
Row height:
approximately 64px.
Do not use giant cards.
Clicking a row opens the Review Match drawer without leaving the Review Queue.
Selected row should receive a subtle orange tint.
==================================================
REVIEW MATCH DRAWER
Use a large right-side drawer approximately 620–680px wide.
Header:
Review Match
ACT-2026-0842
Status:
Needs Review
Supporting:
Actual Start · Piping · Area B
The content hierarchy is mandatory and must appear in this exact order:
1. FIELD EVIDENCE
2. EXTRACTED ACTUAL
3. SUGGESTED SCHEDULE MATCH
4. CONFIDENCE
5. MATCHING SIGNALS
6. OTHER CANDIDATES
7. SCHEDULE CONTEXT
8. HUMAN DECISION ACTIONS
==================================================
FIELD EVIDENCE
Show FIRST:
FIELD EVIDENCE
“Spool erected in Area B.
Final bolt tightening pending.”
Metadata:
Supervisor Update
26 Aug 2026 · 08:42
Action:
View Full Evidence
Do NOT show the AI recommendation before the evidence.
==================================================
EXTRACTED ACTUAL
Show:
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
Line Reference:
24-XX
Use “Not reported” for missing fields.
Use an Inferred badge where relevant.
==================================================
SUGGESTED SCHEDULE MATCH
Show:
ERECT LINE 24-XX
L6 · Piping · Area B
91% confidence
Strong match
Style as AI Suggested.
Do NOT style as Verified.
==================================================
MATCHING SIGNALS
Show a clean vertical list:
Line Reference:
Strong
Discipline:
Match
Area:
Match
Terminology:
Strong
Hierarchy:
Compatible
Add one concise explanation:
This candidate ranks highest because the line reference, discipline and area align with the reported execution event.
Do NOT expose internal chain-of-thought.
==================================================
OTHER CANDIDATES
Show:
INSTALL PIPE SUPPORT 24-XX
46%
L6 · Piping · Area B
HYDROTEST LINE 24-XX
18%
L6 · Piping · Area B
Rows should be selectable.
==================================================
SCHEDULE CONTEXT
Use a collapsed accordion by default.
When opened:
ERECT LINE 24-XX
Planned Start:
24 Aug
Planned Finish:
30 Aug
Current Actual Start:
Not reported
Status:
Not Started
==================================================
REVIEW FOOTER
Use a sticky footer.
Actions:
Mark Unmatched
Choose Another
Accept Match
Accept Match is the primary gradient CTA.
Request Clarification should remain available as a tertiary action.
==================================================
ACCEPT MATCH BEHAVIOR
When Accept Match is clicked:
Show a brief state:
Verifying...
Then simulate:
Review Decision created
Actual becomes Verified
Schedule Actual Start updated
Audit event created
Success toast:
Match verified
ERECT LINE 24-XX updated successfully.
Update queue count:
7 pending
→
6 pending
Remove the verified row from the default pending list with a subtle transition.
Do NOT reload the whole page.
==================================================
CHOOSE ANOTHER
Open a nested modal:
Choose Schedule Activity
Search activity ID or description...
Show results:
ERECT LINE 24-XX
L6 · Piping · Area B
INSTALL PIPE SUPPORT 24-XX
L6 · Piping · Area B
HYDROTEST LINE 24-XX
L6 · Piping · Area B
After Planner chooses a different activity, return to the Review Match drawer and display:
PLANNER SELECTED
selected activity
Also preserve:
Original AI Recommendation
ERECT LINE 24-XX · 91%
Never overwrite the AI history.
==================================================
MARK UNMATCHED
Open confirmation dialog:
Keep this Actual unmatched?
The execution event will remain in SENTINEL but will not update the project schedule.
Optional Comment
Cancel
Keep Unmatched
Do NOT delete the Actual.
==================================================
REQUEST CLARIFICATION
Open a small modal or inline workflow:
Request Clarification
Question:
Which line or activity does this update refer to?
Recipient:
Original Reporter
Send Request
After sending:
Status:
Awaiting Clarification
==================================================
BULK REVIEW
Allow checkboxes on policy-eligible strong matches only.
Example:
☑ Spool erection — 96%
☑ Support installation — 94%
☐ Foundation work — 46%
Low-confidence/ambiguous items should not be bulk-verifiable.
Show tooltip:
This item requires individual review.
Bulk action bar:
2 selected
Verify Selected
Clear
Do not permit unsafe bulk approval.
==================================================
ROLE RULES
Planner:
full Review Queue actions
Project Controls:
full review actions with deeper context
Supervisor:
can submit progress but cannot verify schedule truth
Project Manager:
read-only if directly linked
==================================================
TRUST RULES
1. Evidence comes before AI recommendation.
2. AI Suggested is never styled as Verified.
3. Confidence does not equal approval.
4. Missing data is never fabricated.
5. Human reviewer identity must be preserved.
6. Original AI recommendation must remain in history if a Planner overrides it.
7. Capture can succeed even when schedule matching fails.
8. Supervisor should not need to know L5/L6 IDs.
9. Only human-verified actuals may become official schedule truth.
==================================================
RESPONSIVENESS
Desktop:
large right-side drawers
Tablet:
Review Queue hides lower-priority columns
Drawers reduce width
Mobile:
Review Queue rows become cards
Drawers become full-screen overlays
Sticky action footer remains accessible
For mobile Log Progress, prioritize:
- natural-language input
- clarification
- structured preview
- submit
==================================================
ACCESSIBILITY
Use semantic form labels.
Keep keyboard navigation functional.
Move focus correctly when clarification appears.
Make candidate selection keyboard accessible.
Ensure sticky footer does not cover focused fields.
Use visible focus rings.
Do not communicate confidence/status using color only.
==================================================
VISUAL CONSISTENCY
Reuse the currently approved SENTINEL visual system.
Preserve:
- existing logo
- current system typography
- current KPI number typography
- #F46F29 / #F59B4C brand system
- dark mode
- card styling
- radii
- spacing rhythm
- outline icon language
- restrained glass
- restrained orange
Do NOT redesign the existing Dashboard.
Do NOT add a floating chatbot.
Do NOT create other application pages in this batch.
Build reusable components for all new surfaces so later batches inherit the same system.
FINAL EXPERIENCE GOAL:
The user should naturally understand:
what the field reported
→ what SENTINEL understood
→ where SENTINEL thinks it belongs
→ why
→ what alternatives exist
→ what the authorized human decided
The AI must feel embedded in the operational workflow, not like a separate chatbot.