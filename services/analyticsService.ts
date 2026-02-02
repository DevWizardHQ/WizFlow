/**
 * Analytics service for calculating financial statistics
 */

import {
  getTransactions,
  type TransactionFilters
} from '@/database/operations/transactions';
import type { TransactionType } from '@/types';
import type { Transaction, Category } from '@/types';
import { getDateRange, type Period } from '@/utils/dateUtils';

/**
 * Income and expense summary
 */
export interface IncomeExpenseSummary {
  income: number;
  expenses: number;
  net: number;
}

/**
 * Category breakdown data
 */
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
  icon?: string;
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  label: string;
  income: number;
  expenses: number;
  date: Date;
}

/**
 * Get income and expense summary for a period
 */
export async function getIncomeExpenseSummary(period: Period): Promise<IncomeExpenseSummary> {
  const range = getDateRange(period);
  
  const filters: TransactionFilters = {
    startDate: range.start.toISOString(),
    endDate: range.end.toISOString()
  };

  const transactions = await getTransactions(filters);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    net: income - expenses
  };
}

/**
 * Get category breakdown for a period
 */
export async function getCategoryBreakdown(
  type: 'income' | 'expense',
  period: Period
): Promise<CategoryBreakdown[]> {
  const range = getDateRange(period);
  
  const filters: TransactionFilters = {
    type,
    startDate: range.start.toISOString(),
    endDate: range.end.toISOString()
  };

  const transactions = await getTransactions(filters);

  // Group by category
  const categoryMap = new Map<string, number>();
  transactions.forEach(t => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  // Convert to array and calculate percentages
  const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
  
  let breakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return breakdown;
}

/**
 * Get daily totals for a period
 */
export async function getDailyTotals(period: Period): Promise<TimeSeriesPoint[]> {
  const range = getDateRange(period);
  
  const filters: TransactionFilters = {
    startDate: range.start.toISOString(),
    endDate: range.end.toISOString()
  };

  const transactions = await getTransactions(filters);

  // Group by date
  const dailyMap = new Map<string, { income: number; expenses: number }>();
  
  transactions.forEach(t => {
    const dateKey = t.date.split('T')[0]; // YYYY-MM-DD format
    const current = dailyMap.get(dateKey) || { income: 0, expenses: 0 };
    
    if (t.type === 'income') {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }
    
    dailyMap.set(dateKey, current);
  });

  // Convert to time series points
  return Array.from(dailyMap.entries())
    .map(([dateStr, data]) => ({
      label: dateStr,
      income: data.income,
      expenses: data.expenses,
      date: new Date(dateStr)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get weekly totals for a period
 */
export async function getWeeklyTotals(period: Period): Promise<TimeSeriesPoint[]> {
  const range = getDateRange(period);
  
  const filters: TransactionFilters = {
    startDate: range.start.toISOString(),
    endDate: range.end.toISOString()
  };

  const transactions = await getTransactions(filters);

  // Group by week (Monday-based week)
  const weeklyMap = new Map<string, { income: number; expenses: number; date: Date }>();

  transactions.forEach(t => {
    const date = new Date(t.date);
    // Calculate Monday of the week (weekStartsOn: 1 = Monday)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const current = weeklyMap.get(weekKey) || { income: 0, expenses: 0, date: weekStart };

    if (t.type === 'income') {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }
    
    weeklyMap.set(weekKey, current);
  });

  // Convert to time series points
  return Array.from(weeklyMap.entries())
    .map(([dateStr, data]) => ({
      label: dateStr,
      income: data.income,
      expenses: data.expenses,
      date: new Date(dateStr)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get monthly totals for a year
 */
export async function getMonthlyTotals(year: number = new Date().getFullYear()): Promise<TimeSeriesPoint[]> {
  const filters: TransactionFilters = {
    startDate: new Date(year, 0, 1).toISOString(),
    endDate: new Date(year, 11, 31).toISOString()
  };

  const transactions = await getTransactions(filters);

  // Group by month
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const current = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
    
    if (t.type === 'income') {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }
    
    monthlyMap.set(monthKey, current);
  });

  // Convert to time series points
  return Array.from(monthlyMap.entries())
    .map(([dateStr, data]) => ({
      label: dateStr,
      income: data.income,
      expenses: data.expenses,
      date: new Date(dateStr)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get top spending categories for a period
 */
export async function getTopCategories(period: Period, limit: number = 5): Promise<CategoryBreakdown[]> {
  const breakdown = await getCategoryBreakdown('expense', period);
  return breakdown.slice(0, limit);
}
