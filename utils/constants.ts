/**
 * Application constants for WizFlow
 */

import type { AccountType, CategoryType } from '@/types';

/**
 * Supported currencies
 */
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
] as const;

export const DEFAULT_CURRENCY = 'BDT';

/**
 * Account type options
 */
export const ACCOUNT_TYPES: { value: AccountType; label: string; icon: string }[] = [
  { value: 'general', label: 'General', icon: 'wallet' },
  { value: 'cash', label: 'Cash', icon: 'cash' },
  { value: 'bank', label: 'Bank Account', icon: 'business' },
  { value: 'credit', label: 'Credit Card', icon: 'card' },
  { value: 'investment', label: 'Investment', icon: 'trending-up' },
];

/**
 * Default account
 */
export const DEFAULT_ACCOUNT = {
  name: 'Main Account',
  type: 'bank',
  color: '#4CAF50', // Green
  icon: 'business',
};

/**
 * Color palette for accounts and categories
 */
export const COLOR_PALETTE = [
  '#FF6B6B', // Red
  '#FF8E53', // Orange
  '#FFCD56', // Yellow
  '#4BC0C0', // Teal
  '#36A2EB', // Blue
  '#9966FF', // Purple
  '#FF6384', // Pink
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#00BCD4', // Cyan
  '#3F51B5', // Indigo
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#E91E63', // Deep Pink
  '#9C27B0', // Deep Purple
] as const;

/**
 * Default expense categories
 */
export const DEFAULT_EXPENSE_CATEGORIES: {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  sort_order: number;
}[] = [
  { name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', type: 'expense', sort_order: 1 },
  { name: 'Transport', icon: 'car', color: '#36A2EB', type: 'expense', sort_order: 2 },
  { name: 'Shopping', icon: 'cart', color: '#FFCD56', type: 'expense', sort_order: 3 },
  { name: 'Bills & Utilities', icon: 'receipt', color: '#4BC0C0', type: 'expense', sort_order: 4 },
  { name: 'Healthcare', icon: 'medkit', color: '#FF6384', type: 'expense', sort_order: 5 },
  { name: 'Education', icon: 'school', color: '#9966FF', type: 'expense', sort_order: 6 },
  { name: 'Entertainment', icon: 'game-controller', color: '#FF8E53', type: 'expense', sort_order: 7 },
  { name: 'Travel', icon: 'airplane', color: '#00BCD4', type: 'expense', sort_order: 8 },
  { name: 'Groceries', icon: 'basket', color: '#4CAF50', type: 'expense', sort_order: 9 },
  { name: 'Personal Care', icon: 'heart', color: '#E91E63', type: 'expense', sort_order: 10 },
  { name: 'Home', icon: 'home', color: '#795548', type: 'expense', sort_order: 11 },
  { name: 'Other', icon: 'ellipsis-horizontal', color: '#607D8B', type: 'expense', sort_order: 99 },
];

/**
 * Default income categories
 */
export const DEFAULT_INCOME_CATEGORIES: {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  sort_order: number;
}[] = [
  { name: 'Salary', icon: 'briefcase', color: '#4CAF50', type: 'income', sort_order: 1 },
  { name: 'Freelance', icon: 'laptop', color: '#36A2EB', type: 'income', sort_order: 2 },
  { name: 'Investment', icon: 'trending-up', color: '#9966FF', type: 'income', sort_order: 3 },
  { name: 'Gift', icon: 'gift', color: '#FF6384', type: 'income', sort_order: 4 },
  { name: 'Refund', icon: 'refresh', color: '#4BC0C0', type: 'income', sort_order: 5 },
  { name: 'Other Income', icon: 'add-circle', color: '#607D8B', type: 'income', sort_order: 99 },
];

/**
 * All default categories combined
 */
export const DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

/**
 * Date format options
 */
export const DATE_FORMATS = [
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
] as const;

export const DEFAULT_DATE_FORMAT = 'MM/dd/yyyy';

/**
 * App info
 */
export const APP_NAME = 'WizFlow';
export const APP_VERSION = '1.0.0';
