Build the first high-fidelity foundation of a desktop web application called SENTINEL.

IMPORTANT:
For this first build, create ONLY:
1. The reusable application shell
2. Responsive left sidebar
3. Glassmorphic top header
4. Dashboard / Project Overview page
5. Reusable design-system components required by this page

Do NOT create any other pages yet.
Do NOT redesign or invent new navigation.
Do NOT add a generic chatbot.
Do NOT create backend/database logic yet.
Use centralized realistic mock data so that the frontend can later be connected to APIs.

PRODUCT

SENTINEL is an Actual Progress Capture & Schedule-Reconciliation Layer for infrastructure project management.

Core purpose:
Turn field execution into trusted schedule intelligence.

It connects unstructured field execution updates, reports, spreadsheets and site records with structured L5/L6 project schedule activities.

The interface must communicate:
- Trust
- Traceability
- Precision
- Human control over AI
- Project execution intelligence

It must NOT look like:
- a generic admin template
- a generic project-management app
- an AI chatbot product
- a futuristic/neon dashboard

==================================================
DESIGN TOKENS
==================================================

Primary Brand:
#F46F29

Primary Light:
#F59B4C

Primary Gradient:
linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)

Text Primary:
#3F3F3F

Text Muted:
#6E6E73

Page Background:
#FAFAFC

Glass Background:
rgba(255,255,255,0.75)

Border:
rgba(63,63,63,0.12)

Primary Tint:
rgba(244,111,41,0.10)

Primary Focus:
rgba(244,111,41,0.35)

Primary Glow:
0 4px 16px rgba(244,111,41,0.25)

Use Apple-inspired translucent materials:

backdrop-filter: blur(20px) saturate(180%)

Use restrained glassmorphism only on:
- sidebar
- header
- overlays
- selected important surfaces

Do NOT make every card excessively transparent.

==================================================
TYPOGRAPHY
==================================================

Use:

-apple-system,
BlinkMacSystemFont,
"SF Pro Text",
"SF Pro Display",
Inter,
sans-serif

Header tracking:
-0.02em

Typography hierarchy:

Page Heading:
26px / 32px

Section Heading:
20px / 26px

Component Heading:
16px / 22px

Body:
14px / 21px

Secondary:
13px / 19px

Caption:
11-12px

10px minimum only for micro labels.

Never use 10px for body copy, buttons or important data.

==================================================
RADII
==================================================

Badges/tooltips:
8px

Buttons/inputs:
10px

Tables/compact containers:
12px

Cards:
16px

Drawers:
18px

Modals:
22px

Avoid excessive pill-shaped components.

==================================================
MOTION
==================================================

Use subtle, trustworthy motion.

Fast:
120-160ms

Normal:
180-240ms

Drawer:
240-320ms

Button hover:
scale(1.01)

Primary CTA hover:
soft orange glow

Avoid:
- bouncing
- dramatic transitions
- glowing animated AI effects
- excessive movement

Respect prefers-reduced-motion.

==================================================
APPLICATION SHELL
==================================================

Primary canvas target:
1440 × 900 desktop

Expanded sidebar:
248px

Collapsed sidebar:
72px

Header:
64px

Main page horizontal padding:
28-32px

Desktop layout:

SIDEBAR | HEADER
        | MAIN CONTENT

==================================================
SIDEBAR
==================================================

Use a translucent glass sidebar.

At the top:

SENTINEL product logo placeholder
SENTINEL wordmark

Below:

Project selector:

PROJECT

Infrastructure Expansion
Project Alpha

Navigation groups:

OVERVIEW
Dashboard

EXECUTION
Actuals
Reports

PLANNING
Schedule

REVIEW
Review Queue
Exceptions

INSIGHTS
Performance
Data Quality
Execution Knowledge

SYSTEM
Audit Log
Administration

For this build, ONLY Dashboard needs to be functional.
The other navigation items may exist visually but should not generate their pages yet.

Active Dashboard item:

background:
rgba(244,111,41,0.10)

text:
#F46F29

font-weight:
600

Add a 3px orange vertical indicator on the left.

Sidebar items:
42-44px height
10px radius

Use clean rounded outline icons from one consistent icon library.

Bottom sidebar:

+ Capture Progress

then user:

Arjun Mehta
Planner

and collapse button.

The sidebar must support expanded and collapsed states.

Collapsed:
- 72px wide
- icons remain
- labels disappear
- tooltips appear
- active state remains obvious

==================================================
HEADER
==================================================

Glassmorphic header.

Right side:

Search field
Notification bell
Light/Dark mode switch
User avatar

Search field:

Search SENTINEL...

Include small "/" shortcut badge.

Do not overload the header.

==================================================
DASHBOARD
==================================================

Page title:

Project Overview

Supporting text:

Execution status, schedule variance and items requiring attention.

Right side:

28 Aug 2026

+ Capture Progress

Use the primary orange gradient only on + Capture Progress.

==================================================
DASHBOARD KPI CARDS
==================================================

Create FIVE compact KPI cards in one row on wide desktop.

1. EXECUTION
68.4%
Plan 71.2%
2.8% behind plan

2. STARTED LATE
23
5 require attention

3. FINISHED LATE
11
3 over 5 days

4. NEEDS REVIEW
7
3 low confidence

5. EXCEPTIONS
3
1 conflict

Cards:
- 16px radius
- subtle glass surface
- restrained border
- very soft shadow
- no giant icons
- strong numerical hierarchy
- clickable hover state

Do not use circular gauges.

==================================================
PRIMARY DASHBOARD ROW
==================================================

Use a 62 / 38 layout.

LEFT:
Plan vs Actual

RIGHT:
Needs Attention

==================================================
PLAN VS ACTUAL
==================================================

Card title:
Plan vs Actual

Supporting:
Verified execution progress

Top summary:

Actual
68.4%

Plan
71.2%

Variance
-2.8%

Use a precise line chart.

Plan:
neutral slate/dark gray line

Actual:
#F46F29 orange line

No giant gradient area fill.

X axis:
Aug 1
Aug 8
Aug 15
Aug 22
Aug 28

Tooltip example:

22 Aug

Plan
65.9%

Actual
62.8%

Variance
-3.1%

Include:
View Schedule →

==================================================
NEEDS ATTENTION
==================================================

Title:
Needs Attention

7 active items

View All →

Use 4 compact rows separated by subtle dividers.

1.

ERECT LINE 24-XX

Started 2 days late

Piping · Area B

View →

2.

EQUIPMENT ALIGNMENT — P-204

Conflicting Actual Start

Rotating Equipment · Utility Block

Resolve →

3.

CABLE TRAY INSTALLATION — UTILITY BLOCK

Actual Start missing

Electrical

Inspect →

4.

FOUNDATION BLOCK C-14

Match requires review

Civil

Review →

Do not create a card inside a card for every row.

==================================================
SECONDARY ROW
==================================================

Two columns:

Recent Execution

Discipline Performance

==================================================
RECENT EXECUTION
==================================================

Show:

Spool erection

Actual Start · Piping · Area B

26 Aug 2026

Verified


Pump P-204 alignment

Actual Start · Rotating Equipment

28 Aug 2026

Awaiting Review


Foundation Block C-14

Actual Finish · Civil

27 Aug 2026

Verified

Include:
View Actuals →

==================================================
DISCIPLINE PERFORMANCE
==================================================

Use horizontal compact progress comparison rows.

Piping
Plan 69%
Actual 64%
Variance -5%

Civil
Plan 74%
Actual 72%
Variance -2%

Rotating Equipment
Plan 70%
Actual 68%
Variance -2%

Electrical
Plan 73%
Actual 75%
Variance +2%

Instrumentation
Plan 66%
Actual 61%
Variance -5%

Do NOT use multiple donut charts.

==================================================
THIRD ROW
==================================================

Two columns:

Review Health

Data Quality

REVIEW HEALTH:

Pending Reviews
7

Low Confidence
3

Ambiguous
2

Incomplete
2

View Queue →


DATA QUALITY:

Source Coverage
94%

Match Confidence
89%

Missing Fields
4.2%

Unmatched Rate
2.8%

View Details →

Do NOT invent a single overall quality score.

==================================================
RECENT CHANGES
==================================================

Full width lower section.

Recent Changes

View Audit Log →

Rows:

10:44
Actual Start updated
ERECT LINE 24-XX
— → 26 Aug
Arjun Mehta

10:44
Match verified
ACT-2026-0842
ERECT LINE 24-XX
Arjun Mehta

08:42
Actual extracted
Pump P-204 alignment
SENTINEL

==================================================
ROLE / DATA RULES
==================================================

Current prototype role:
Planner

Current user:
Arjun Mehta

Current project:
Infrastructure Expansion

Use centralized mock data.

Do NOT scatter conflicting sample values throughout components.

Official Dashboard performance metrics must represent VERIFIED actuals only.

Pending AI suggestions can appear under:
- Review Health
- Needs Attention
- Recent Execution

but must NOT alter official Plan vs Actual numbers.

==================================================
RESPONSIVENESS
==================================================

Desktop:
expanded sidebar

Tablet:
sidebar collapsible
KPI grid can become 3 + 2

Mobile:
do not compress the desktop dashboard

Prioritize:
- Project status
- Capture Progress
- Execution
- Needs Attention
- Recent Execution
- simplified Plan vs Actual

Tables/lists should reflow cleanly.

==================================================
ACCESSIBILITY
==================================================

Use:
- semantic HTML
- keyboard navigation
- visible focus rings
- accessible color contrast
- labels in addition to colors
- tooltips for icon-only controls
- minimum comfortable touch targets
- reduced-motion support

==================================================
DARK MODE
==================================================

Implement a functional dark mode.

Use charcoal, not pure black.

Orange brand remains restrained.

Dark glass surfaces must remain readable.

==================================================
IMPORTANT FINAL RULES
==================================================

Do NOT generate other SENTINEL pages yet.

Do NOT add backend/database integrations.

Do NOT add a generic floating AI chatbot.

Do NOT invent new navigation.

Do NOT change the supplied Dashboard information architecture.

Build reusable components rather than one-off styling.

The Dashboard should communicate:

"Here is the trusted state of project execution,
where reality differs from plan,
and what needs human attention."

Not:

"Look at how much AI the product has."