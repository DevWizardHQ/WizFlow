# Tasks: Add Analytics & Statistics

## Phase 1: Data Services

### 1.1 Analytics Data Service
- [x] Create `services/analyticsService.ts`
- [x] Implement `getIncomeExpenseSummary(period)` - totals by type
- [x] Implement `getCategoryBreakdown(type, period)` - amounts per category
- [x] Implement `getDailyTotals(period)` - daily income/expense
- [x] Implement `getWeeklyTotals(period)` - weekly totals
- [x] Implement `getMonthlyTotals(year)` - monthly totals

### 1.2 Period Utilities
- [x] Create `utils/dateUtils.ts` - date range helpers
- [x] Implement `getDateRange(period)` - start/end for period
- [x] Implement `formatPeriodLabel(date)` - display formatting
- [x] Implement period constants (TODAY, THIS_WEEK, THIS_MONTH, etc.)

## Phase 2: Chart Components

### 2.1 Chart Wrapper Components
- [x] Create `components/Charts/PieChart.tsx` - Category breakdown
- [x] Create `components/Charts/BarChart.tsx` - Time trends
- [x] Create `components/Charts/LineChart.tsx` - Balance over time
- [x] Create `components/Charts/ChartLegend.tsx` - Chart legend

### 2.2 Summary Components
- [x] Create `components/SummaryCard.tsx` - Income/expense totals
- [x] Create `components/TrendIndicator.tsx` - Up/down arrow with %
- [x] Create `components/PeriodSelector.tsx` - Period filter tabs

## Phase 3: Stats Screen

### 3.1 Update Stats Tab
- [x] Update `app/(tabs)/stats.tsx` with analytics layout
- [x] Add period selector at top
- [x] Add income/expense summary cards
- [x] Add category pie chart section
- [x] Add trends bar chart section

### 3.2 Screen Sections
- [x] Implement summary header (total income, total expense, net)
- [x] Implement category breakdown with pie chart
- [x] Implement top spending categories list
- [x] Implement time trend chart
- [x] Implement empty state for no data

## Phase 4: Interactivity

### 4.1 Period Filtering
- [x] Implement period state management
- [x] Connect period selector to charts
- [x] Refresh data on period change
- [x] Show loading state during data fetch

### 4.2 Chart Interactions
- [x] Add tap on pie slice for category detail
- [x] Add tap on bar for day detail
- [x] Show tooltip on chart interaction

## Phase 5: Polish

### 5.1 Animations
- [x] Add chart entrance animations
- [x] Add number counting animations
- [x] Smooth period transitions

### 5.2 Validation
- [x] Verify calculations accuracy
- [x] Test with various data ranges
- [x] Test empty data states
- [x] Performance test with large datasets

## Dependencies
- Phase 1 services needed for Phase 2 & 3
- Phase 2 components needed for Phase 3
- Phase 4 depends on Phase 3
- Phase 5 is final polish

## Estimated Effort
- Phase 1: ~2-3 hours
- Phase 2: ~3-4 hours
- Phase 3: ~3-4 hours
- Phase 4: ~2 hours
- Phase 5: ~2 hours

**Total: ~12-15 hours**

