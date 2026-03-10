# Novaris — Decision Center Blueprint
## Data, Charts & Input Specification · v1.1

> **Internal product document.** This blueprint defines every data point, chart type, calculation, and user input required to build the Decision Center. Written for product, engineering, and data teams.

---

## A Note on the Engine

The Decision Center is not AI. It is a **Decision Support System (DSS)** — a structured calculation engine that ingests business data, applies deterministic formulas and weighted scoring models, runs Monte Carlo simulations, and outputs a narrative generated from the result of those calculations. The language used in the interface is templated and data-filled — not generated. Every sentence on screen maps directly to a formula output.

---

## Navigation Architecture — Single Unified Menu

Rather than three separate nav sections (Overview / Finance / Operations), the Decision Center uses **one unified sidebar menu**. The reasoning: Finance and Operations are not separate departments in an SME — they are the same problem viewed from two angles. Separating them in the nav reinforces the silo the product is designed to break.

### Menu Structure

```
Novaris
│
├── Decision Center          ← Primary view. The full story.
│
├── ── ANALYZE ──────────────
│
├── Cash & Liquidity         ← Finance-only deep dive (standalone)
├── Revenue & Gaps           ← Revenue tracking deep dive (standalone)
├── Projects & Delays        ← Operations deep dive (standalone)
├── Compliance               ← Compliance checklist & score
│
├── ── PLAN ─────────────────
│
├── Scenario Builder         ← Standalone what-if engine (also embedded in Decision Center)
├── Risk Map                 ← Full risk score matrix, all categories
│
├── ── SETTINGS ─────────────
│
└── Settings                 ← Thresholds, integrations, preferences
```

**Key rule:** Each item under ANALYZE can be used completely independently — an owner can go directly to *Cash & Liquidity* or *Projects & Delays* without ever visiting the Decision Center. The Decision Center is the view that **combines** all of them into a single story. It is the reason you have all the other pages, not the other way around.

**Why this works better than three menu groups:**
- One scrollable menu with clear section dividers reads faster than labelled groups
- The ANALYZE / PLAN split explains *what kind of thinking* each page supports
- Finance + Operations not artificially separated — the Risk Bridge in the Decision Center is the bridge between them
- Scenario Builder surfaced as its own page so owners can use it independently, not just as an embedded widget

---

## Table of Contents

1. [Decision Center — Overview](#1-decision-center--overview)
2. [Zone A — KPI Strip](#2-zone-a--kpi-strip)
3. [Zone B — Decision Narrative](#3-zone-b--decision-narrative)
4. [Zone C — Risk Bridge](#4-zone-c--risk-bridge)
5. [Zone D — Domino Chain](#5-zone-d--domino-chain)
6. [Zone E — Metric Charts](#6-zone-e--metric-charts)
7. [Zone F — Analysis Panels](#7-zone-f--analysis-panels)
8. [Resilience Shield](#8-resilience-shield--sidebar-widget)
9. [Standalone Module Inputs](#9-standalone-module-inputs)
10. [Data Refresh & Integration](#10-data-refresh--integration)
11. [Appendix — Input Field Reference](#appendix--complete-input-field-reference)

---

## 1. Decision Center — Overview

The Decision Center is the primary screen. Its purpose is not to display data — it is to tell a story. Every panel answers a question the owner has not yet thought to ask. It combines the outputs of the four ANALYZE modules (Cash, Revenue, Projects, Compliance) into a single coherent narrative with a recommended course of action.

### 1.1 Screen Structure

Six zones rendered in a fixed vertical order. Each zone feeds from the one above it — they are chapters, not widgets.

| Zone | Panel | Purpose |
|------|-------|---------|
| A | KPI Strip | Four headline metrics. Current health at a glance. Readable in 5 seconds. |
| B | Decision Narrative | The DSS-generated story of the most critical risk chain active right now. |
| C | Risk Bridge | How finance and operations are feeding each other today. Side-by-side cause → effect. |
| D | Domino Chain | The exact cascade of consequences if nothing changes. Horizontal sequence. |
| E | Metric Charts | Three charts: Revenue Gap timeline, Liquidity Gauge, Monte Carlo distribution. |
| F | Analysis Panels | Risk Score Table + Scenario Builder — for drilling deeper and testing decisions. |

### 1.2 Narrative Generation — How It Actually Works

The narrative is **not written by AI**. It is produced by a **template engine** that selects and fills pre-written sentence structures based on calculation outputs. The process:

1. All input data is ingested and calculations run (burn rate, LFI, gap, chain probability)
2. The DSS identifies the **primary risk** — the single risk category with the highest score that has breached a threshold
3. The DSS identifies the **active causal chain** — which other metrics are connected to the primary risk
4. A **template is selected** from a library of ~40 pre-written risk narrative templates, each designed for a specific risk pattern (e.g. "low runway + project delay + payment block")
5. The template is **filled** with the calculated values from step 1 (dollar amounts, day counts, percentages, project names)
6. The result is rendered as the narrative paragraph the owner reads

This means every word on screen is deterministic and auditable — if the numbers change, the template fills with different values and a different (or different-priority) template may be selected.

---

## 2. Zone A — KPI Strip

Four cards across the top. Each monitors one critical business dimension. The strip is the owner's first read every time they open the app.

---

### KPI 1 — Cash Runway

**What it shows:** How many days the business can continue operating at current burn rate before cash runs out. The single most critical number for any SME owner.

#### Inputs Required

| Input Field | Type | Description |
|-------------|------|-------------|
| Current Cash Balance | Currency ($) | Total liquid cash across all connected bank accounts or manually entered. Updated on each sync or manual save. |
| Total Operating Expenses (last 30 days) | Currency ($) — 30-day total | All outgoing payments in the last 30 days: payroll, rent, utilities, subscriptions, vendor payments, loan repayments. Used to derive daily burn. |
| Accounts Receivable Due (next 30 days) | Currency ($) | Outstanding invoices expected within the next 30 days. Used to compute the adjusted (more optimistic) runway figure. |

#### Calculation

```
Daily Burn Rate     =  Total Operating Expenses (30d) ÷ 30
Base Runway         =  Current Cash Balance ÷ Daily Burn Rate
Adjusted Runway     =  (Current Cash + AR Due in 30d) ÷ Daily Burn Rate
```

The card displays **Base Runway** as the primary figure. Adjusted Runway is shown as a secondary line beneath it (e.g. "52 days if $22K AR collected").

#### Threshold Flags

| Range | Status | Card State |
|-------|--------|------------|
| > 60 days | Safe | Green accent bar + green value |
| 45 – 60 days | Monitor | Neutral — no flag |
| 30 – 44 days | Warning | Amber accent bar + amber value |
| < 30 days | Critical | Red accent bar + red value + triggers Domino Chain + elevates Narrative to High Priority |

> **Configurable:** The 45-day safe threshold and 30-day critical threshold are editable in Settings → Risk Thresholds. Different businesses have different cash cycle rhythms.

---

### KPI 2 — Monthly Revenue

**What it shows:** Total revenue recognised month-to-date vs the owner's monthly revenue target. Shows absolute value and percentage variance.

#### Inputs Required

| Input Field | Type | Description |
|-------------|------|-------------|
| Monthly Revenue Target | Currency ($) | Set during onboarding. The baseline against which all monthly performance is measured. Editable in Settings. |
| Revenue to Date (MTD) | Auto / Manual | Sum of all paid/completed invoices in the current calendar month. From accounting integration or manually entered per invoice. |
| Pending Revenue (current month) | Currency ($) | Invoices issued but not yet paid, due within the current month. Displayed as a sub-line only — not included in the primary MTD figure. |

#### Calculation

```
Variance %  =  ((Revenue MTD − Monthly Target) ÷ Monthly Target) × 100
```

---

### KPI 3 — Daily Burn Rate

**What it shows:** Average daily cash spend over a rolling 30-day window, plus the month-over-month change as a percentage. Flags accelerating spend before it becomes a crisis.

#### Inputs Required

| Input Field | Type | Description |
|-------------|------|-------------|
| Operating Expenses (last 30d) | Auto / Manual | All outgoing payments in the last 30 days. Same data as KPI 1 — shared calculation. |
| Expense Category Breakdown | Categorised | Expenses must be split into: Fixed Costs / Variable Costs / One-Time Costs. One-Time costs are excluded from burn trend calculation to avoid distortion from irregular spend. |
| Prior 30-day Expenses | Historical | The same expense figure from the previous 30-day window. Used exclusively for the trend indicator. |

#### Calculation

```
Daily Burn Rate   =  (Fixed Costs + Variable Costs last 30d) ÷ 30
Burn Trend %      =  ((This 30d Burn − Prior 30d Burn) ÷ Prior 30d Burn) × 100
```

> **Flag:** A Burn Trend increase of > 15% month-over-month triggers a Risk Bridge update and flags this card with an amber or red indicator. Default threshold configurable in Settings → Risk Thresholds.

---

### KPI 4 — Compliance Score

**What it shows:** A composite score (0–100%) representing how complete the business is across its regulatory and operational compliance obligations. An internal operational health indicator — not a legal guarantee.

#### Inputs Required

| Input Field | Type | Description |
|-------------|------|-------------|
| Compliance Checklist Items | User-defined list | Each item has: a name, due date, and recurrence pattern. Set up during onboarding. Examples: quarterly tax filings, license renewals, insurance renewals, payroll compliance dates, regulatory submissions. |
| Completion Status (per item) | Binary | Each item is marked Complete / Pending / Overdue. The system auto-flags Overdue when the due date passes without completion. |
| Audit Date | Date (optional) | If an upcoming scheduled audit is entered, the dashboard shows a countdown and escalates nearby pending items as the date approaches. |

#### Calculation

```
Base Score   =  (Complete Items ÷ Total Items) × 100
Penalty      =  −5 points per Overdue item (configurable)
Final Score  =  Base Score − Penalty (floor: 0)
```

---

## 3. Zone B — Decision Narrative

The largest card on the screen. The DSS-generated risk story: the most critical risk chain active right now, explained in plain language, with the numbers filled in, and specific action options at the end. Every sentence maps to a calculation output.

### 3.1 Narrative Engine — Input Data

The DSS ingests the following data to construct the narrative:

| Data Input | Source | Role |
|------------|--------|------|
| Cash Runway | KPI 1 calculation | Primary trigger detection. If below threshold, narrative leads with liquidity fragility as root cause. |
| Burn Rate + Trend | KPI 3 calculation | Sets the pace of deterioration. Determines urgency tone of the narrative. |
| Active Projects + Delay Status | Projects & Delays module | Identifies which project is delayed, by how many days, and what payment it is blocking. |
| Accounts Receivable (by invoice) | Cash & Liquidity module | Converts "project is delayed" into a specific dollar figure at risk. |
| Revenue Gap | Revenue & Gaps module | Shows the widening distance between target and projected end-of-period revenue. |
| Monte Carlo Probability Output | Simulation engine | Provides the probability percentage attached to the narrative's stated outcome (e.g. "78% probability in 60 days"). |
| LFI Score | Liquidity Fragility Index | Determines which narrative template tier is selected (low / medium / high urgency). |

### 3.2 Template Selection Logic

The DSS selects a narrative template based on the combination of active risk states:

| Primary Risk | Secondary Risk Active? | Template Selected |
|-------------|----------------------|-------------------|
| Low runway only | No | Template: "Single liquidity pressure" |
| Low runway | Project delay active | Template: "Liquidity fragility chain" ← most common |
| Low runway | Burn accelerating | Template: "Accelerating burn pressure" |
| Project delay only | No revenue gap yet | Template: "Delivery risk — payment exposure" |
| Revenue gap only | No cash pressure | Template: "Revenue shortfall — monitor" |
| Multiple risks simultaneous | — | Template: "Compound risk — priority action required" |

> The template library contains ~40 patterns. Each template has pre-written sentence structures with `{{variable}}` placeholders that are filled with live calculation values before rendering.

### 3.3 Tab Structure

| Tab | Content |
|-----|---------|
| The Story | Two paragraphs. Plain language. No jargon. Readable in 30 seconds. Names the risk, the chain, the dollar figures, and the consequence of inaction. |
| The Numbers | Structured data table — every input feeding the current narrative, with its current value and source. Lets the owner verify the figures behind the story. |
| Run Scenarios | Embeds the Scenario Builder inline. The owner can immediately test the narrative's suggested actions without scrolling. |
| Actions | Prioritised list of 3–5 specific, one-sentence actions ranked by expected impact on the primary risk. Each links to the relevant workflow inside the app. |

### 3.4 Action Chips

Below the narrative paragraphs, 3–6 quick-action chips appear. Each is a one-phrase label for a recommended action. Tapping a chip either opens the relevant workflow or pre-fills the Scenario Builder with that action applied at its suggested value.

---

## 4. Zone C — Risk Bridge

Shows the causal connections between financial conditions and operational conditions. Breaks the silo: a cash problem is also a project problem. A project delay is also a cash problem. The Risk Bridge shows both directions simultaneously.

### 4.1 Chart Type

**Bidirectional cause-effect node map.**
- Two columns per row: **Trigger** (left) → arrow → **Effect** (right)
- Maximum 4 active bridge pairs visible at once, ranked by severity
- Inactive bridges are hidden — not shown as empty rows
- Trigger nodes flagged scarlet (financial triggers) or amber (operational triggers)
- Effect nodes use muted amber or steel blue

### 4.2 Bridge Pairs — Data Sources

| Trigger Type | Trigger Condition | Effect | Effect Description |
|-------------|-------------------|--------|--------------------|
| Finance → Operations | Cash Runway < threshold | Project Stalling | Cash pressure causes owner to reduce resource hours on active projects. |
| Finance → Operations | Burn Rate accelerates > trigger% MoM | Hiring Freeze Risk | Spend outpacing revenue — new headcount or project starts become uncertain. |
| Operations → Finance | Active project slips > delay tolerance | Revenue Gap Widening | Specific blocked payment quantified: the invoice tied to that delivery is at risk. Value shown. |
| Operations → Finance | Project velocity = 0 for > stall window | Payment Deferral Risk | Project is active but not moving. Connected client payment escalated as at-risk. |
| Finance → Finance | Burn > inflows for 2 consecutive weeks | Runway Collapse Trajectory | Compounding: if burn exceeds inflow consistently, the runway reduction accelerates non-linearly. |

### 4.3 User Inputs — Sensitivity Settings

These control when bridges fire. All editable in Settings → Risk Thresholds.

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| Cash threshold (trigger) | Number (days) | 45 days | Runway level at which a Finance → Operations bridge fires. |
| Project delay tolerance | Number (days) | 3 days | Days a project can slip before an Operations → Finance bridge fires. Editable globally or per project. |
| Burn rate acceleration trigger | Percentage (%) | 15% | MoM burn increase that fires a Finance bridge. Higher = less sensitive. |
| Stall detection window | Number (days) | 5 days | Consecutive days of zero project velocity before a stall bridge fires. |

---

## 5. Zone D — Domino Chain

A horizontal sequence of 3–6 connected nodes showing the cascade of consequences flowing from the current primary risk. Not a prediction — a structured projection of what happens if no action is taken, based on current trajectory and the delay/burn/gap calculations already performed.

### 5.1 Chart Type

**Horizontal connected node sequence.**
- 3–6 nodes, connected by directional arrows
- Scrollable horizontally on smaller screens
- Node anatomy: step number + event label + impact description (2 lines max per node)
- Color fades across the chain: Scarlet (trigger) → Amber (ripple) → Steel Blue (amplify) → Faded grey (critical end-state)
- Maximum 6 nodes. If the calculation produces a longer chain, nodes 4–6 are compressed into a summary node

### 5.2 Node Construction Logic

Each node is constructed from live calculation data — not hardcoded.

| Node | Label Source | Impact Text Source |
|------|-------------|-------------------|
| 01 — Trigger | The specific KPI or metric that breached a threshold. Named with its current value. | Threshold name + how far it has been breached. |
| 02 — Ripple | First downstream operational consequence. Derived from active Risk Bridge triggers. | Plain-language explanation of why this follows from Node 01. |
| 03 — Ripple | Project-level consequence. Linked to the slowest / most at-risk project in the pipeline. | Calculated from: current project velocity + remaining scope → projected slip in weeks. |
| 04 — Amplify | Financial consequence of Node 03. Quantified in dollars. | Blocked payment value + existing gap. Shows before ($X) and after ($Y) figures. |
| 05 — Amplify | Compound burn consequence. What happens to cash when inflows drop and burn continues. | (Daily Burn × days remaining in period) vs projected inflows in the same window. |
| 06 — Critical | End-state failure class. Qualitative label only. | One of: Operations Freeze Risk / Payroll Risk / Debt Default Risk. Determined by which KPI hits zero first in the projection. |

### 5.3 Chain Probability

The headline probability shown on the chain (e.g. "68% probability") is taken from the Monte Carlo simulation output for the "base case — current trajectory" scenario. It is the percentage of the 10,000 simulations in which the chain reached Node 04 or beyond.

---

## 6. Zone E — Metric Charts

Three charts in a three-column grid. Each answers one specific question. Together they provide the quantitative evidence for the narrative above.

---

### Chart 1 — Revenue Gap Timeline

**Question answered:** How far is actual revenue from where it should be — and how fast is that gap growing?

**Chart type:** Grouped Bar Chart with a dashed reference line.

| Element | Description |
|---------|-------------|
| X-axis | Time: 8 weekly columns (5 historical + 3 projected). |
| Y-axis | Revenue in dollars. Values shown on hover — axis itself unlabelled. |
| Actual series | Solid bars. Steel blue at 50% opacity. Confirmed paid revenue per week. |
| Projected series | Semi-transparent bars. Scarlet at 35% opacity. Future weeks only. Calculated from current trajectory using selected projection method. |
| Target series | Solid bars. Green at 40% opacity. Weekly revenue target (monthly target ÷ 4.3). |
| Gap reference line | Horizontal dashed line in Scarlet at the target height. The visual distance between bar tops and this line is the gap. |

#### Inputs Required

| Input Field | Type | Default | Description |
|-------------|------|---------|-------------|
| Monthly Revenue Target | Currency ($) | Set in onboarding | Divided by 4.3 to produce the weekly target for the chart. Editable in Settings. |
| Confirmed Revenue (per week) | Auto / Manual | — | Sum of paid invoices grouped by the week paid. From accounting integration or entered per invoice. |
| Revenue Projection Method | Dropdown | Conservative | **Conservative** — 15% discount to current trajectory. **Linear** — continues current trajectory flat. **Optimistic** — assumes all pending AR converts. |
| Pending Invoices (current period) | Currency ($) | — | Open invoices for current and future weeks. Used only in Optimistic projection mode. |

---

### Chart 2 — Liquidity Fragility Gauge

**Question answered:** In one number and one visual — how close to the financial edge is this business right now?

**Chart type:** Semi-circular arc gauge (dial/speedometer).

| Element | Description |
|---------|-------------|
| Range | 0 (safe) to 100 (critical). The LFI is a composite index, not a raw financial figure. |
| Arc zones | 0–35: green or no fill / 36–65: amber fill / 66–100: scarlet fill. |
| Arc fill | Fills from left to the current LFI score. Colour matches the zone the needle is in. |
| Centre readout | Current LFI number in large type. Same colour as the zone. |
| Below the gauge | Three supporting data rows: Days of cash cover · Current ratio · Receivables at risk. |

#### Liquidity Fragility Index (LFI) — Calculation

Four sub-scores, each normalised to 0–100, weighted and summed:

| Sub-Score | Weight | Input Used | Scoring Logic |
|-----------|--------|------------|---------------|
| Cash Runway Score | 35% | Days of cash cover | < 15d = 100 · 15–30d = 80 · 30–45d = 60 · 45–60d = 30 · > 60d = 0 |
| Burn Trend Score | 25% | MoM burn change % | Each 5% increase adds 8 pts. Each 5% decrease subtracts 5 pts. Capped 0–100. |
| AR Overdue Risk Score | 25% | AR overdue >30d as % of total AR | < 10% = 0 · 10–25% = 30 · 25–50% = 60 · > 50% = 90 |
| Current Ratio Score | 15% | Current assets ÷ current liabilities | > 2.0 = 0 · 1.5–2.0 = 20 · 1.0–1.5 = 50 · < 1.0 = 90 |

```
LFI  =  (Runway Score × 0.35) + (Burn Score × 0.25) + (AR Score × 0.25) + (Ratio Score × 0.15)
```

#### Inputs Required (beyond KPI inputs)

| Input Field | Type | Description |
|-------------|------|-------------|
| Total Current Assets | Currency ($) | Cash + inventory + receivables due within 90 days. Manual entry or from balance sheet integration. |
| Total Current Liabilities | Currency ($) | All obligations due within 12 months: accounts payable, short-term debt, accrued expenses. |
| AR Overdue Breakdown | Categorised | Outstanding invoices split into: 0–30 days / 31–60 days / 60+ days overdue. The 30+ column drives the AR sub-score. |

---

### Chart 3 — Monte Carlo Distribution

**Question answered:** Given everything Novaris knows about this business right now — what are the realistic financial outcomes over the next 60 days, and how likely is each?

**Chart type:** Probability distribution histogram (bar chart variant).

| Element | Description |
|---------|-------------|
| X-axis | Cash outcome range in dollars. Centre = current cash position (base). Left = worse outcomes. Right = better outcomes. |
| Y-axis | Relative probability density. Not labelled — bar height represents likelihood. |
| Bar colouring | Left (bad) bars: Scarlet, fading toward centre. Centre bars: Steel blue at peak opacity. Right bars: fade to muted steel. |
| Scenario rows | Below the chart: 3 named scenarios (Worst / Base / Best) with their probability percentages from the simulation. |

#### How the Simulation Works

The DSS runs **10,000 simulations** per full calculation cycle. Each simulation independently samples from probability distributions assigned to the four key variables:

| Variable | Distribution | Default Parameters |
|----------|-------------|-------------------|
| Revenue realisation rate | Beta distribution | Derived from last 6 months of invoice payment rates. Default: 70–90% of invoiced amount collected per month. |
| Project delivery timing | Poisson distribution | Mean = planned delivery date. Lambda from historical on-time delivery rate. Default lambda: 0.7 (30% slip probability per project per period). |
| Expense variance | Normal distribution | Mean = current monthly expenses. Standard deviation = 8% of mean (configurable). |
| Client payment timing | Empirical (user history) | Days-to-pay distribution built from actual invoice payment history per client category. |

Each simulation produces a projected cash balance at the selected time horizon. The 10,000 outputs are bucketed into a histogram. The three named scenarios are defined as:
- **Worst case** = outcomes in the bottom 15th percentile
- **Base case** = outcomes between the 40th–60th percentile
- **Best case** = outcomes in the top 20th percentile

#### User Inputs — Simulation Assumptions

| Input Field | Type | Default | Description |
|-------------|------|---------|-------------|
| Simulation time horizon | Dropdown | 60 days | 30 / 60 / 90 days. Longer horizons widen the distribution spread significantly. |
| Revenue assumption | Dropdown | Base (current rate) | Conservative (70% collection rate) / Base (current rate) / Optimistic (90%). Changes Beta distribution parameters. |
| Expense volatility | Slider 0–20% | 8% | Standard deviation for the expense normal distribution. Higher = more variable cost outcomes simulated. |
| Project delivery confidence | Slider 0–100% | 70% | Adjusts Poisson lambda. 100% = full confidence in stated delivery dates. 0% = treat all dates as rough estimates. |

---

## 7. Zone F — Analysis Panels

Two panels side by side. Left: Risk Score Table. Right: Scenario Builder.

---

### Panel 1 — Risk Score Table

A ranked table of all active risk categories monitored for this business. Sorted by severity score, highest first. Clicking a row navigates to the full standalone module for that category.

**Chart type:** Data table with inline micro-bar per row.

| Column | Description |
|--------|-------------|
| Risk Category | Name of the risk dimension. Five defaults ship with all accounts. Additional categories configurable in Settings. |
| Score (0–100) | Composite severity score. Colour: 0–30 neutral · 31–60 amber · 61–100 scarlet. |
| Exposure bar | Horizontal bar scaled 0–100. Width = score. Colour matches score range. |
| Trend | ↑ Worsening / → Stable / ↓ Improving. Based on score delta over the last 7 days. |

#### Default Categories & Scoring Logic

| Category | Scoring Logic | Primary Inputs |
|----------|--------------|----------------|
| Liquidity Fragility | Same as the LFI Gauge (Chart 2). Shared calculation — not recalculated separately. | Cash balance, burn rate, AR, current ratio |
| Project Bottleneck | Composite: delayed project count (40%) + average delay severity in days (35%) + blocked payment value as % of monthly revenue (25%). | Project pipeline, project dates, linked invoices |
| Revenue Gap Risk | Composite: current month gap as % of target (50%) + gap trajectory — widening or narrowing (30%) + overdue client account count (20%). | Revenue MTD, monthly target, AR aging |
| Compliance Gap | Inverse of Compliance Score KPI. `Score = 100 − Compliance Score`. Each overdue item within 7 days adds 10 bonus penalty points. | Compliance checklist items |
| Market Exposure | Optional. User-defined: customer concentration (% revenue from top client) + sector volatility + geographic exposure. Default: 0 until configured. | User-configured in Settings → Risk Categories |

---

### Panel 2 — Scenario Builder

A what-if calculation engine. The owner adjusts sliders; the DSS re-runs a **1,000-simulation fast pass** (< 1 second) and updates the outcome panel. The full 10,000-simulation pass only runs on explicit "Run Simulation" trigger.

> The Scenario Builder is also available as a **standalone page** from the PLAN section of the nav — so owners can use it independently without going through the Decision Center.

#### Slider Inputs — Complete Specification

| Slider | Range | Default | What it Simulates | Effect on Output |
|--------|-------|---------|------------------|-----------------|
| Cash Injection | $0 – $100,000 | $0 | A one-time cash inflow added to current balance. Models a loan, investment, or personal capital injection. | Extends runway. Lowers LFI score. Shifts Monte Carlo distribution right. |
| Project Delivery Acceleration | 0 – 4 weeks early | 0 weeks | Reduces the projected delivery date of the highest-risk project by the selected number of weeks. Models committing more resources or descoping. | Unblocks the deferred AR payment sooner. Reduces revenue gap. Reduces Domino Chain probability. |
| Overhead Reduction | $0 – $10,000 /mo | $0 | Reduces monthly operating expenses. Models cutting non-essential spend, renegotiating contracts, or pausing discretionary costs. | Lowers daily burn rate. Extends cash runway. Lowers LFI burn trend sub-score. |
| Early Invoice Collection Rate | 0% – 100% | Historical rate | Percentage of outstanding AR the owner expects to collect in the next 30 days. Higher = more aggressive collections effort being made. | Increases near-term cash inflow. Lowers AR risk sub-score. Extends runway in the scenario. |
| New Revenue (30 days) | $0 – $50,000 | $0 | Models winning new business in the next 30 days. Adds a one-time revenue event to the simulation. | Reduces revenue gap. Improves Monte Carlo best-case probability. Does not affect burn rate. |

#### Scenario Output Panel

Updates within 1 second of each slider change.

| Output Field | Description |
|-------------|-------------|
| Projected Runway | New runway in days. Shown with ±delta vs current unadjusted figure. |
| Revenue Gap Projection | Projected end-of-quarter gap in dollars. Shown with ±delta. |
| Shield Level Achieved | Whether the adjusted scenario reaches Shield Level 1 or Level 2 (see Section 8). |
| Narrative Summary | One sentence. Describes the scenario outcome in plain language, filled with the calculated values. |

---

## 8. Resilience Shield — Sidebar Widget

Shown permanently in the sidebar. Translates the full set of risk calculations into one concept: **how many independent bad events can this business absorb simultaneously right now?**

The four bar segments represent Shield Levels 1–4. Filled bar = that level is achieved. Partial/amber = one condition is unmet.

| Shield Level | Definition | Conditions Required |
|-------------|------------|---------------------|
| Level 0 (none) | Cannot safely absorb even a single unexpected shock. | LFI > 70, OR Runway < 20 days, OR Revenue Gap > 40% of monthly target |
| Level 1 | Safe if only one bad thing happens at a time. | LFI 35–70 · Runway 30–59 days · Revenue Gap < 25% of target · No critical compliance items overdue |
| Level 2 | Can absorb two simultaneous shocks (e.g. project delay AND client payment default). | LFI < 35 · Runway > 60 days · Revenue Gap < 10% of target · Compliance Score > 90% |
| Level 3+ | Resilient to cascading failures across all monitored dimensions simultaneously. | All Level 2 conditions plus: Current Ratio > 2.0 · Burn Trend stable or decreasing · All projects on schedule |

---

## 9. Standalone Module Inputs

Each page under ANALYZE can be used independently. The following inputs are required per module to produce standalone calculations and charts without the Decision Center.

### Cash & Liquidity (standalone)

Produces: Cash Runway chart over time, Burn Rate trend chart, LFI Gauge, AR aging breakdown.

| Input | Type | Required? |
|-------|------|-----------|
| Current Cash Balance | Currency ($) | Required |
| Operating Expenses (last 30d) | Currency ($) | Required |
| Expense Category Breakdown | Fixed / Variable / One-Time | Recommended |
| Total Current Assets | Currency ($) | Recommended |
| Total Current Liabilities | Currency ($) | Recommended |
| AR by invoice (amount + due date) | Per invoice | Recommended |
| AR Overdue Breakdown | Categorised by age | Recommended |

### Revenue & Gaps (standalone)

Produces: Revenue Gap Timeline, target vs actual vs projected chart, overdue client account list.

| Input | Type | Required? |
|-------|------|-----------|
| Monthly Revenue Target | Currency ($) | Required |
| Revenue to Date (MTD) | Auto / Manual | Required |
| Pending Invoices | Currency ($) + due date | Required |
| Revenue Projection Method | Dropdown | Optional |

### Projects & Delays (standalone)

Produces: Project pipeline view, delay severity score per project, blocked payment exposure per project, bottleneck risk score.

| Input | Type | Required? |
|-------|------|-----------|
| Project Name | Text | Required |
| Planned Delivery Date | Date | Required |
| Linked Payment Amount | Currency ($) | Required |
| Current Status | Active / Stalled / Complete / Delayed | Required |
| Last Velocity Update | Date | Recommended |
| Delay Tolerance (per project) | Number (days) | Optional — global default used if not set |

### Scenario Builder (standalone)

Same sliders and output panel as the embedded version in the Decision Center. Can be used without any connection to the narrative or Domino Chain — purely as a financial what-if calculator.

Required to be useful: all inputs from Cash & Liquidity + at least one active project in Projects & Delays.

---

## 10. Data Refresh & Integration

### Automatic Integrations (Planned)

| Integration | Data Provided | Refresh Frequency |
|-------------|--------------|-------------------|
| Xero / QuickBooks | Revenue, expenses, AR, AP, cash balance, invoice status | Daily sync at 06:00 local time. Manual sync available. |
| Bank feed (Open Banking) | Real-time cash balance, transaction history | Real-time via webhook on each transaction event. |
| Project tools (Jira / Asana / Linear) | Project status, delivery dates, velocity metrics | Every 4 hours. Manual sync available. |

### Manual Entry Fallback

For users without integrations, every data point has a manual entry equivalent. A data freshness indicator on each KPI card shows when data was last updated. Cards with data older than 7 days display a stale-data warning and prompt the owner to update.

### Calculation Trigger

The full DSS recalculates — narrative template selection, Domino Chain, LFI, Monte Carlo (10,000 sims), Risk Scores — on:

1. Automatic data sync completes
2. User saves a manual data entry
3. Scenario Builder slider moved (fast 1,000-sim pass only)
4. User explicitly triggers "Run Simulation" from the page header

---

## Appendix — Complete Input Field Reference

Every user input required across the Decision Center and standalone modules.

| Input Field | Type | Where Entered | Required for DC? |
|-------------|------|---------------|-----------------|
| Current Cash Balance | Currency ($) | Onboarding / Settings / Bank sync | Required |
| Monthly Operating Expenses (30d) | Currency ($) | Onboarding / Accounting integration | Required |
| Monthly Revenue Target | Currency ($) | Onboarding / Settings | Required |
| Accounts Receivable (by invoice) | $ + due date + client | Invoicing module / Integration | Required |
| Project Name | Text | Projects & Delays module | Required (Domino Chain) |
| Project Planned Delivery Date | Date | Projects & Delays module | Required (Domino Chain) |
| Project Linked Payment Amount | Currency ($) | Projects & Delays module | Required (Domino Chain) |
| Project Current Status | Dropdown | Projects & Delays module | Required (Domino Chain) |
| Expense Category Breakdown | Fixed / Variable / One-Time | Onboarding / Settings | Recommended |
| Compliance Checklist Items | Name + due date + recurrence | Settings → Compliance | Recommended |
| Total Current Assets | Currency ($) | Onboarding / Balance Sheet | Recommended (LFI) |
| Total Current Liabilities | Currency ($) | Onboarding / Balance Sheet | Recommended (LFI) |
| AR Overdue Breakdown | Categorised by age bracket | Integration / Manual | Recommended (LFI) |
| Pending Revenue (current month) | Currency ($) | Invoicing module | Recommended |
| Revenue Projection Method | Dropdown | Settings → Simulation | Optional |
| Cash threshold (Risk Bridge) | Number (days) | Settings → Risk Thresholds | Optional |
| Project delay tolerance | Number (days) | Settings / per project | Optional |
| Burn rate trigger threshold | Percentage (%) | Settings → Risk Thresholds | Optional |
| Stall detection window | Number (days) | Settings → Risk Thresholds | Optional |
| Monte Carlo time horizon | Dropdown (30/60/90d) | Simulation panel / Settings | Optional |
| Expense volatility assumption | Percentage (0–20%) | Simulation panel | Optional |
| Project delivery confidence | Percentage (0–100%) | Simulation panel | Optional |
| Market Exposure inputs | Concentration %, sector, geography | Settings → Risk Categories | Optional |
| Audit Date | Date | Settings → Compliance | Optional |

---

*End of document — Novaris Decision Center Blueprint v1.1*
