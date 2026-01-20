# Spec: Analytics

## ADDED Requirements

### REQ-ANA-001: Stats Screen Overview
The Stats tab shall display financial analytics and charts.

#### Scenario: View Stats Screen
- **Given** the user has transactions
- **When** the Stats tab is selected
- **Then** analytics overview is displayed
- **And** charts and summaries are shown

#### Scenario: Empty Stats State
- **Given** no transactions exist
- **When** viewing the Stats screen
- **Then** an empty state is shown
- **And** a message prompts user to add transactions

---

### REQ-ANA-002: Period Selector
The Stats screen shall allow filtering by time period.

#### Scenario: Period Options
- **Given** the Stats screen is displayed
- **When** viewing the period selector
- **Then** the following options are available:
  - Today
  - This Week
  - This Month
  - This Year
  - Custom Range (future)

#### Scenario: Change Period
- **Given** a period is selected
- **When** the user selects a different period
- **Then** all charts and summaries update
- **And** data reflects the new period

#### Scenario: Default Period
- **Given** the Stats screen loads
- **When** no period is explicitly selected
- **Then** "This Month" is selected by default

---

### REQ-ANA-003: Income/Expense Summary
The Stats screen shall show income and expense totals.

#### Scenario: Summary Cards Display
- **Given** transactions exist for the period
- **When** viewing summary cards
- **Then** total income is displayed (green)
- **And** total expenses are displayed (red)
- **And** net balance is displayed

#### Scenario: Summary Calculation
- **Given** the period is "This Month"
- **When** calculating summary
- **Then** only transactions within this month are summed
- **And** income and expense are calculated separately

---

### REQ-ANA-004: Category Breakdown Chart
The Stats screen shall show spending by category.

#### Scenario: Pie Chart Display
- **Given** expense transactions exist
- **When** viewing category breakdown
- **Then** a pie chart shows expense distribution
- **And** each slice represents a category
- **And** slice colors match category colors

#### Scenario: Category Legend
- **Given** the pie chart is displayed
- **When** viewing the chart
- **Then** a legend shows category names
- **And** amounts and percentages are visible

#### Scenario: Top Categories List
- **Given** category data exists
- **When** viewing below the pie chart
- **Then** top spending categories are listed
- **And** categories are sorted by amount descending

---

### REQ-ANA-005: Time Trend Chart
The Stats screen shall show spending trends over time.

#### Scenario: Bar Chart Display
- **Given** transactions exist over multiple days
- **When** viewing the trend chart
- **Then** a bar chart shows daily/weekly totals
- **And** income and expense bars are differentiated

#### Scenario: Chart Granularity
- **Given** viewing trend chart
- **When** period is "This Week"
- **Then** bars show daily totals
- **When** period is "This Month"
- **Then** bars show weekly totals
- **When** period is "This Year"
- **Then** bars show monthly totals

---

### REQ-ANA-006: Balance Over Time
The Stats screen shall optionally show balance trend.

#### Scenario: Line Chart Display
- **Given** account balance history exists
- **When** viewing balance trend
- **Then** a line chart shows balance over time
- **And** trend direction is indicated

---

### REQ-ANA-007: Chart Interactions
Charts shall respond to user interactions.

#### Scenario: Tap Pie Slice
- **Given** the pie chart is displayed
- **When** the user taps a category slice
- **Then** category details are highlighted
- **And** exact amount and percentage shown

#### Scenario: Tap Bar
- **Given** the bar chart is displayed
- **When** the user taps a bar
- **Then** the exact value for that period is shown

---

### REQ-ANA-008: Analytics Calculations
Analytics service shall calculate accurate statistics.

#### Scenario: Income Total
- **Given** income transactions exist
- **When** calculating income total
- **Then** all income type transactions are summed
- **And** only transactions in period are included

#### Scenario: Expense Total
- **Given** expense transactions exist
- **When** calculating expense total
- **Then** all expense type transactions are summed
- **And** only transactions in period are included

#### Scenario: Category Percentages
- **Given** expense breakdown is calculated
- **When** displaying percentages
- **Then** each category shows (category_amount / total_expenses) * 100
- **And** percentages sum to 100%

