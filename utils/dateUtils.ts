/**
 * Date utilities for analytics period calculations
 */

import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  isWithinInterval,
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isValid,
  parseISO
} from 'date-fns';

/**
 * Period types for analytics
 */
export type Period = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get date range for a given period
 */
export function getDateRange(period: Period): DateRange {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    
    case 'thisWeek':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(now, { weekStartsOn: 1 }) // Sunday
      };
    
    case 'thisMonth':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    
    case 'thisYear':
      return {
        start: startOfYear(now),
        end: endOfYear(now)
      };
    
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
  }
}

/**
 * Format period label for display
 */
export function formatPeriodLabel(period: Period): string {
  switch (period) {
    case 'today':
      return 'Today';
    case 'thisWeek':
      return 'This Week';
    case 'thisMonth':
      return 'This Month';
    case 'thisYear':
      return 'This Year';
    default:
      return 'This Month';
  }
}

/**
 * Check if a date is within a period
 */
export function isDateInPeriod(date: Date, period: Period): boolean {
  const range = getDateRange(period);
  return isWithinInterval(date, range);
}

/**
 * Get all days in a period
 */
export function getDaysInPeriod(period: Period): Date[] {
  const range = getDateRange(period);
  return eachDayOfInterval(range);
}

/**
 * Get all weeks in a period
 */
export function getWeeksInPeriod(period: Period): Date[] {
  const range = getDateRange(period);
  return eachWeekOfInterval(range, { weekStartsOn: 1 });
}

/**
 * Get all months in a period
 */
export function getMonthsInPeriod(period: Period): Date[] {
  const range = getDateRange(period);
  return eachMonthOfInterval(range);
}

/**
 * Safely convert various inputs to a valid Date or return null.
 * Accepts Date | string | number | null | undefined.
 */
function toDate(input: Date | string | number | null | undefined): Date | null {
  if (input === null || input === undefined) return null;
  if (input instanceof Date) return isValid(input) ? input : null;
  if (typeof input === 'number') {
    const d = new Date(input);
    return isValid(d) ? d : null;
  }
  if (typeof input === 'string') {
    // Try ISO parse first, then fall back to the Date constructor for other formats
    let d = parseISO(input);
    if (!isValid(d)) {
      d = new Date(input);
    }
    return isValid(d) ? d : null;
  }
  return null;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  const dt = toDate(date);
  return dt ? format(dt, 'MMM dd, yyyy') : '';
}

/**
 * Format date with time for display
 */
export function formatDateTime(date: Date | string | number | null | undefined): string {
  const dt = toDate(date);
  return dt ? format(dt, 'MMM dd, yyyy HH:mm') : '';
}

/**
 * Format short date for charts
 */
export function formatShortDate(date: Date | string | number | null | undefined): string {
  const dt = toDate(date);
  return dt ? format(dt, 'MMM dd') : '';
}

/**
 * Format month for charts
 */
export function formatMonth(date: Date | string | number | null | undefined): string {
  const dt = toDate(date);
  return dt ? format(dt, 'MMM') : '';
}

/**
 * Period constants
 */
export const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisYear', label: 'This Year' },
];